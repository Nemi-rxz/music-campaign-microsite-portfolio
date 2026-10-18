import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { ARTISTS } from '@/app/data/artists'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'votes.json')
const DAYS_TO_EVENT = 25
const BLOB_KEY = 'poll-store.json'

type PollStore = {
  eventDate: string
  votes: Record<string, number>
}

type Backend = 'kv' | 'blob' | 'file' | 'memory'

function seedVotes(): Record<string, number> {
  const votes: Record<string, number> = {}
  for (const artist of ARTISTS) votes[artist.id] = artist.seedVotes
  return votes
}

function defaultEventDate(): string {
  return new Date(Date.now() + DAYS_TO_EVENT * 24 * 60 * 60 * 1000).toISOString()
}

function defaultStore(): PollStore {
  return { eventDate: defaultEventDate(), votes: seedVotes() }
}

function normalizeStore(parsed: Partial<PollStore> | null | undefined): PollStore {
  const votes: Record<string, number> = {}
  for (const artist of ARTISTS) {
    const value = parsed?.votes?.[artist.id]
    votes[artist.id] = typeof value === 'number' ? value : artist.seedVotes
  }
  return { eventDate: parsed?.eventDate || defaultEventDate(), votes }
}

/* ---------------- Vercel KV (preferred if present) ---------------- */

function hasKv(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function kvRead(): Promise<PollStore> {
  const { kv } = await import('@vercel/kv')
  let eventDate = (await kv.get<string>('poll:eventDate')) || null
  if (!eventDate) {
    eventDate = defaultEventDate()
    await kv.set('poll:eventDate', eventDate)
  }
  const existing = (await kv.hgetall<Record<string, number>>('poll:votes')) || {}
  if (!existing || Object.keys(existing).length === 0) {
    await kv.hset('poll:votes', seedVotes())
  }
  const votes = (await kv.hgetall<Record<string, number>>('poll:votes')) || {}
  for (const artist of ARTISTS) {
    if (typeof votes[artist.id] !== 'number') votes[artist.id] = artist.seedVotes
  }
  return { eventDate, votes }
}

async function kvVote(artistId: string): Promise<PollStore> {
  const { kv } = await import('@vercel/kv')
  await kv.hincrby('poll:votes', artistId, 1)
  return kvRead()
}

/* ---------------- Vercel Blob (shared + persistent in production) ---------------- */

function blobToken(): string | undefined {
  return process.env.POLL_READ_WRITE_TOKEN
}

function hasBlob(): boolean {
  return Boolean(blobToken())
}

async function blobWrite(store: PollStore) {
  const { put } = await import('@vercel/blob')
  await put(BLOB_KEY, JSON.stringify(store), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: blobToken()!,
  })
}

async function blobRead(): Promise<PollStore> {
  const { head } = await import('@vercel/blob')
  const token = blobToken()!
  let url: string | null = null
  try {
    const blob = await head(BLOB_KEY, { token })
    url = blob.url
  } catch {
    url = null
  }

  if (!url) {
    const store = defaultStore()
    await blobWrite(store)
    return store
  }

  // Cache-bust so overwrite reads return the latest tally.
  const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) {
    const store = defaultStore()
    await blobWrite(store)
    return store
  }
  return normalizeStore((await res.json()) as Partial<PollStore>)
}

async function blobVote(artistId: string): Promise<PollStore> {
  const store = await blobRead()
  store.votes[artistId] = (store.votes[artistId] ?? 0) + 1
  await blobWrite(store)
  return store
}

/* ---------------- File store (local dev fallback) ---------------- */

function fileRead(): PollStore {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const store = defaultStore()
      fileWrite(store)
      return store
    }
    return normalizeStore(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as PollStore)
  } catch {
    return defaultStore()
  }
}

function fileWrite(store: PollStore) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8')
}

function fileVote(artistId: string): PollStore {
  const store = fileRead()
  store.votes[artistId] = (store.votes[artistId] ?? 0) + 1
  fileWrite(store)
  return store
}

function fileWritable(): boolean {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.accessSync(DATA_DIR, fs.constants.W_OK)
    return true
  } catch {
    return false
  }
}

/* ---------------- In-memory (last resort, e.g. read-only serverless) ---------------- */

let memoryStore: PollStore | null = null
function memoryRead(): PollStore {
  if (!memoryStore) memoryStore = defaultStore()
  return memoryStore
}
function memoryVote(artistId: string): PollStore {
  const store = memoryRead()
  store.votes[artistId] = (store.votes[artistId] ?? 0) + 1
  return store
}

/* ---------------- Backend selection ---------------- */

async function chooseBackend(): Promise<Backend> {
  if (hasKv()) return 'kv'
  if (hasBlob()) return 'blob'
  if (fileWritable()) return 'file'
  return 'memory'
}

async function readStore(backend: Backend): Promise<PollStore> {
  switch (backend) {
    case 'kv':
      return kvRead()
    case 'blob':
      return blobRead()
    case 'file':
      return fileRead()
    default:
      return memoryRead()
  }
}

async function voteStore(backend: Backend, artistId: string): Promise<PollStore> {
  switch (backend) {
    case 'kv':
      return kvVote(artistId)
    case 'blob':
      return blobVote(artistId)
    case 'file':
      return fileVote(artistId)
    default:
      return memoryVote(artistId)
  }
}

export async function GET() {
  const backend = await chooseBackend()
  try {
    const store = await readStore(backend)
    return NextResponse.json({ ...store, store: backend })
  } catch (err) {
    console.error('poll GET failed, falling back to memory', err)
    return NextResponse.json({ ...memoryRead(), store: 'memory' })
  }
}

export async function POST(request: Request) {
  let artistId: string | null = null
  try {
    const body = await request.json()
    artistId = typeof body?.artistId === 'string' ? body.artistId : null
    if (!artistId || !ARTISTS.some((a) => a.id === artistId)) {
      return NextResponse.json({ error: 'Invalid artist' }, { status: 400 })
    }

    const backend = await chooseBackend()
    const store = await voteStore(backend, artistId)
    return NextResponse.json({ ...store, store: backend })
  } catch (err) {
    console.error('poll POST failed, falling back to memory', err)
    if (artistId) memoryVote(artistId)
    return NextResponse.json({ ...memoryRead(), store: 'memory' })
  }
}

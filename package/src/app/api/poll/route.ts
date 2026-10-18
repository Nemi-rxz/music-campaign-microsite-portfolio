import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { ARTISTS } from '@/app/data/artists'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'votes.json')
const DAYS_TO_EVENT = 25

type PollStore = {
  eventDate: string
  votes: Record<string, number>
}

type Backend = 'kv' | 'file' | 'memory'

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

/* ---------------- Vercel KV (preferred in production) ---------------- */

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
  // Ensure every known artist has a numeric entry.
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

/* ---------------- File store (local dev fallback) ---------------- */

function fileRead(): PollStore {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const store = defaultStore()
      fileWrite(store)
      return store
    }
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as PollStore
    for (const artist of ARTISTS) {
      if (typeof parsed.votes[artist.id] !== 'number') parsed.votes[artist.id] = artist.seedVotes
    }
    if (!parsed.eventDate) parsed.eventDate = defaultEventDate()
    return parsed
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
  if (fileWritable()) return 'file'
  return 'memory'
}

async function readStore(backend: Backend): Promise<PollStore> {
  switch (backend) {
    case 'kv':
      return kvRead()
    case 'file':
      return fileRead()
    default:
      return memoryRead()
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
  try {
    const body = await request.json()
    const artistId = typeof body?.artistId === 'string' ? body.artistId : null
    if (!artistId || !ARTISTS.some((a) => a.id === artistId)) {
      return NextResponse.json({ error: 'Invalid artist' }, { status: 400 })
    }

    const backend = await chooseBackend()
    let store: PollStore
    if (backend === 'kv') store = await kvVote(artistId)
    else if (backend === 'file') store = fileVote(artistId)
    else store = memoryVote(artistId)

    return NextResponse.json({ ...store, store: backend })
  } catch (err) {
    console.error('poll POST failed, falling back to memory', err)
    try {
      const body = await request.clone().json()
      const artistId = typeof body?.artistId === 'string' ? body.artistId : null
      if (artistId) memoryVote(artistId)
    } catch {
      /* ignore */
    }
    return NextResponse.json({ ...memoryRead(), store: 'memory' })
  }
}

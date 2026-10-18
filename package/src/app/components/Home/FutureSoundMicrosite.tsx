'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ARTISTS } from '@/app/data/artists'
import Countdown from './Countdown'

type Badge = {
  id: string
  name: string
  description: string
  icon: string
  threshold: number
}

const XP_PER_VOTE = 30

const BADGES: Badge[] = [
  { id: 'b1', name: 'First Vote', description: 'Cast your first fan vote', icon: '🗳️', threshold: 1 },
  { id: 'b2', name: 'Tastemaker', description: 'Vote for 3 artists', icon: '🔥', threshold: 3 },
  { id: 'b3', name: 'Superfan', description: 'Vote for 6 artists', icon: '💎', threshold: 6 },
  { id: 'b4', name: 'Campaign Legend', description: 'Vote for every artist', icon: '👑', threshold: ARTISTS.length },
]

// Decorative album-art gallery (aesthetic only, not tied to voting).
const ALBUM_SHOTS: { id: string; label: string; src: string }[] = [
  { id: 'al1', label: 'Studio Sessions', src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop' },
  { id: 'al2', label: 'Vinyl crate', src: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&h=600&fit=crop' },
  { id: 'al3', label: 'Crowd Energy', src: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=600&fit=crop' },
  { id: 'al4', label: 'Live Lights', src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop' },
  { id: 'al5', label: 'Mixing Desk', src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop' },
  { id: 'al6', label: 'Festival Night', src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop' },
]

const VOTED_KEY = 'fs_voted_artists'
const XP_KEY = 'fs_xp'

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const GRADIENTS = [
  'from-fuchsia-500 to-purple-700',
  'from-cyan-400 to-blue-700',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-700',
  'from-rose-400 to-pink-700',
  'from-violet-500 to-indigo-700',
  'from-lime-400 to-green-700',
  'from-sky-400 to-cyan-700',
]

const FutureSoundMicrosite = () => {
  const [votesByArtist, setVotesByArtist] = useState<Record<string, number>>({})
  const [eventDate, setEventDate] = useState<string | null>(null)
  const [votedFor, setVotedFor] = useState<Set<string>>(new Set())
  const [xp, setXp] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showFlash = useCallback((msg: string) => {
    setFlash(msg)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 2200)
  }, [])

  // Load shared poll results from the server.
  const loadPoll = useCallback(async () => {
    try {
      const res = await fetch('/api/poll', { cache: 'no-store' })
      const data = await res.json()
      if (data && data.votes) {
        setVotesByArtist(data.votes)
        if (data.eventDate) setEventDate(data.eventDate)
        setLastUpdated(Date.now())
      }
    } catch {
      // ignore transient fetch errors; next refresh will retry
    }
  }, [])

  // Initial fetch + personal (localStorage) state + keep-alive auto refresh.
  useEffect(() => {
    setHydrated(true)
    try {
      const storedVoted = localStorage.getItem(VOTED_KEY)
      if (storedVoted) setVotedFor(new Set(JSON.parse(storedVoted) as string[]))
      const storedXp = localStorage.getItem(XP_KEY)
      if (storedXp) setXp(Number(storedXp) || 0)
    } catch {
      /* ignore malformed storage */
    }
    loadPoll()
    const id = setInterval(loadPoll, 8000) // live results + keeps page refreshing
    return () => clearInterval(id)
  }, [loadPoll])

  const persistVoted = (next: Set<string>) => {
    setVotedFor(next)
    try {
      localStorage.setItem(VOTED_KEY, JSON.stringify([...next]))
    } catch {
      /* ignore */
    }
  }

  const awardXp = (amount: number) => {
    setXp((prev) => {
      const value = prev + amount
      try {
        localStorage.setItem(XP_KEY, String(value))
      } catch {
        /* ignore */
      }
      return value
    })
  }

  const handleVote = async (artistId: string) => {
    if (votedFor.has(artistId)) {
      showFlash('You already voted for this artist.')
      return
    }
    setIsVoting(artistId)
    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId }),
      })
      const data = await res.json()
      if (res.ok && data.votes) {
        setVotesByArtist(data.votes)
        setLastUpdated(Date.now())
        persistVoted(new Set(votedFor).add(artistId))
        awardXp(XP_PER_VOTE)
        const name = ARTISTS.find((a) => a.id === artistId)?.name ?? 'artist'
        showFlash(`Vote counted for ${name}! +${XP_PER_VOTE} XP`)
      } else {
        showFlash(data?.error ?? 'Could not save your vote.')
      }
    } catch {
      showFlash('Network error — please try again.')
    } finally {
      setIsVoting(null)
    }
  }

  const leaderboard = useMemo(() => {
    const total = Object.values(votesByArtist).reduce((s, n) => s + n, 0)
    return [...ARTISTS]
      .map((a) => {
        const votes = votesByArtist[a.id] ?? 0
        return { ...a, votes, pct: total ? (votes / total) * 100 : 0 }
      })
      .sort((x, y) => y.votes - x.votes)
  }, [votesByArtist])

  const totalVotes = useMemo(
    () => Object.values(votesByArtist).reduce((s, n) => s + n, 0),
    [votesByArtist],
  )

  const unlockedBadges = BADGES.filter((b) => votedFor.size >= b.threshold)

  return (
    <main className='bg-[#050816] text-white'>
      {/* Personal XP HUD */}
      <div className='fixed right-4 top-24 z-50 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-900/20 p-4 backdrop-blur'>
        <div className='flex items-center gap-4'>
          <div className='text-center'>
            <p className='text-[10px] uppercase tracking-wider text-fuchsia-300'>XP</p>
            <p className='text-xl font-bold text-white'>{xp}</p>
          </div>
          <div className='h-8 w-px bg-fuchsia-500/30' />
          <div className='text-center'>
            <p className='text-[10px] uppercase tracking-wider text-fuchsia-300'>Votes</p>
            <p className='text-xl font-bold text-white'>
              {votedFor.size}/{ARTISTS.length}
            </p>
          </div>
        </div>
        {flash && (
          <div className='mt-2 max-w-[180px] text-center text-xs font-semibold text-fuchsia-200 animate-bounce'>
            {flash}
          </div>
        )}
      </div>

      {/* Hero */}
      <section className='relative overflow-hidden border-b border-white/10 pt-32 pb-20'>
        <div className='absolute inset-0 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url('/images/hero/concert-header.jpg')" }} />
        <div className='absolute inset-0 bg-gradient-to-br from-fuchsia-900/80 via-black/70 to-cyan-900/80' />
        <div className='absolute left-10 top-20 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl' />
        <div className='absolute right-10 bottom-20 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl' />
        <div className='container relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8'>
          <p className='text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-300'>
            Fan-powered chart
          </p>
          <h1 className='mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl'>
            Vote for the top Afrobeats artists
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl'>
            Every click counts. Back your favorite stars, watch the results update live for everyone,
            earn XP and unlock badges before The Future Sound.
          </p>
          <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <a
              href='#vote'
              className='inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-fuchsia-700'>
              Vote now
            </a>
            <a
              href='#event'
              className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10'>
              The event
            </a>
          </div>
        </div>
      </section>

      {/* Event + Countdown */}
      <section id='event' className='border-b border-white/10 py-20'>
        <div className='container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-900/30 to-cyan-900/20 p-8 text-center sm:p-12'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300'>
              The Future Sound
            </p>
            <h2 className='mt-4 text-4xl font-bold text-white sm:text-5xl'>
              The live Afrobeats showcase
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300'>
              The fan vote decides who headlines. Doorbashes open when the countdown ends — cast your
              vote before time runs out.
            </p>
            <div className='mt-10'>
              <Countdown targetIso={eventDate} />
            </div>
            <p className='mt-6 text-sm text-slate-400'>
              Event date:{' '}
              {eventDate
                ? new Date(eventDate).toLocaleString(undefined, {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })
                : 'Syncing…'}
            </p>
          </div>
        </div>
      </section>

      {/* Live Poll Leaderboard */}
      <section id='vote' className='border-b border-white/10 py-20'>
        <div className='container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-10 text-center'>
            <h2 className='text-4xl font-bold text-white sm:text-5xl'>Live fan poll</h2>
            <p className='mt-4 text-lg text-gray-300'>
              Shared results for every visitor — refreshing automatically.
            </p>
            <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
              <span className='inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300'>
                <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' /> Live
              </span>
              <button
                onClick={loadPoll}
                className='rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10'>
                Refresh now
              </button>
              <span className='text-sm text-slate-400'>
                {totalVotes.toLocaleString()} total votes
              </span>
              {lastUpdated && (
                <span className='text-xs text-slate-500'>
                  updated {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            {leaderboard.map((artist, index) => {
              const hasVoted = hydrated && votedFor.has(artist.id)
              return (
              <div key={artist.id} className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <div className='flex items-center gap-4'>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950'
                        : index === 1
                          ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-slate-950'
                          : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-amber-700 text-slate-950'
                            : 'bg-white/10 text-white'
                    }`}>
                    #{index + 1}
                  </span>
                  <div
                    className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white sm:flex ${GRADIENTS[index % GRADIENTS.length]}`}>
                    {getInitials(artist.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-3'>
                      <h3 className='truncate font-semibold text-white'>{artist.name}</h3>
                      <div className='shrink-0 text-right'>
                        <p className='text-sm font-semibold text-white'>{artist.votes.toLocaleString()}</p>
                        <p className='text-xs text-gray-400'>{artist.pct.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className='mt-2 h-2 overflow-hidden rounded-full bg-white/10'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-700'
                        style={{ width: `${artist.pct}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleVote(artist.id)}
                    disabled={hasVoted || isVoting === artist.id}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      hasVoted
                        ? 'cursor-not-allowed bg-white/10 text-gray-400'
                        : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:opacity-60'
                    }`}>
                    {hasVoted ? '✓ Voted' : isVoting === artist.id ? 'Voting…' : 'Vote'}
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Decorative album gallery (aesthetics only) */}
      <section className='py-20'>
        <div className='container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 text-center'>
            <h2 className='text-3xl font-bold text-white sm:text-4xl'>Sounds of the movement</h2>
            <p className='mt-3 text-gray-400'>A mood board from the campaign.</p>
          </div>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
            {ALBUM_SHOTS.map((shot) => (
              <div
                key={shot.id}
                className='group relative overflow-hidden rounded-2xl border border-white/10'>
                <img
                  src={shot.src}
                  alt={shot.label}
                  className='aspect-square w-full object-cover transition duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition group-hover:opacity-100' />
                <span className='absolute bottom-2 left-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100'>
                  {shot.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default FutureSoundMicrosite

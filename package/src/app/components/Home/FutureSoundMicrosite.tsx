'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Artist = {
  id: string
  name: string
  city: string
  sound: string
  stage: string
  votes: number
  previewLength: string
  highlight: string
  accent: string
  mood: string[]
}

const artists: Artist[] = [
  {
    id: 'nova-kai',
    name: 'Nova Kai',
    city: 'Lagos, Nigeria',
    sound: 'Alt Afrobeats / Amapiano bounce',
    stage: 'Midnight Pulse',
    votes: 14218,
    previewLength: '00:30',
    highlight: 'A velvet vocal hook built for late-night city drives.',
    accent: 'from-fuchsia-500/30 to-orange-400/20',
    mood: ['Velvet hooks', 'Dancefloor tempo', 'Night-drive energy'],
  },
  {
    id: 'zuri-gold',
    name: 'Zuri Gold',
    city: 'Accra, Ghana',
    sound: 'Soulful Afropop / Highlife textures',
    stage: 'Gold Dust',
    votes: 12944,
    previewLength: '00:30',
    highlight: 'Warm guitar loops and a chorus that feels instantly familiar.',
    accent: 'from-amber-400/30 to-emerald-400/20',
    mood: ['Highlife warmth', 'Radio-ready chorus', 'Golden melodies'],
  },
  {
    id: 'santi-rain',
    name: 'Santi Rain',
    city: 'London, UK',
    sound: 'Diaspora Afrobeats / Electronic percussion',
    stage: 'Signal',
    votes: 11876,
    previewLength: '00:30',
    highlight: 'Club percussion meets diaspora storytelling and slick synths.',
    accent: 'from-cyan-400/30 to-violet-500/20',
    mood: ['Global club cues', 'Future-facing production', 'Bold toplines'],
  },
  {
    id: 'temi-verse',
    name: 'Temi Verse',
    city: 'Johannesburg, South Africa',
    sound: 'Afro-fusion / R&B pulse',
    stage: 'Afterlight',
    votes: 11057,
    previewLength: '00:30',
    highlight: 'Soft-spoken intimacy balanced with a high-energy release.',
    accent: 'from-pink-400/30 to-sky-400/20',
    mood: ['Intimate writing', 'Wide-screen chorus', 'Premium finish'],
  },
]

const stories = [
  {
    title: 'How Future Sound turned fan voting into artist discovery',
    summary:
      'A gamified shortlist mechanic helps emerging artists earn spotlight placement while fans shape the live showcase lineup.',
    tag: 'Strategy',
  },
  {
    title: 'Building a premium Afrobeats campaign world for mobile-first audiences',
    summary:
      'Every section is designed for fast scroll behavior, social sharing, and one-tap actions that keep energy high on small screens.',
    tag: 'Experience',
  },
  {
    title: 'Why culture-led storytelling drives deeper participation',
    summary:
      'The campaign blends artist narratives, sonic previews, and community rituals to create a richer reason to return.',
    tag: 'Insight',
  },
]

const objectives = [
  'Increase discovery for emerging Afrobeats talent across key cultural cities.',
  'Turn passive visitors into active fans through voting, sharing, and signups.',
  'Build a branded campaign world that feels credible to artists, fans, and partners.',
]

const audience = [
  'Gen Z and young millennial Afrobeats listeners who discover music through social-first moments.',
  'Diaspora communities looking for culturally resonant new talent and shareable campaign experiences.',
  'Creative industry partners, curators, and music media seeking next-wave artists with momentum.',
]

const strategy = [
  'Lead with emotion: an immersive hero frames the campaign as an event, not a brochure.',
  'Reward interaction: previews, voting, and social prompts keep the homepage participatory.',
  'Close loops quickly: every section offers a clear next step toward discovery, advocacy, or signup.',
]

const userFlow = [
  'Arrive from social or creator content and understand the campaign proposition in seconds.',
  'Preview artists, compare sounds, and cast a fan vote for the live showcase lineup.',
  'Share favorite talent with friends, then join the newsletter for drops and event reminders.',
]

const outcomes = [
  'Higher artist consideration through repeat visits driven by countdown urgency and fresh voting momentum.',
  'Improved community participation through easy social sharing and lightweight signup conversion.',
  'A stronger premium brand perception that positions Future Sound Afrobeats as a tastemaker platform.',
]

const eventDate = new Date('2026-09-18T20:00:00')
const initialTimeRemaining = {
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00',
}

const padTime = (value: number) => value.toString().padStart(2, '0')

const getTimeRemaining = () => {
  const difference = eventDate.getTime() - Date.now()

  if (difference <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((difference / (1000 * 60)) % 60)
  const seconds = Math.floor((difference / 1000) % 60)

  return {
    days: padTime(days),
    hours: padTime(hours),
    minutes: padTime(minutes),
    seconds: padTime(seconds),
  }
}

const FutureSoundMicrosite = () => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)
  const [activePreview, setActivePreview] = useState<string>(artists[0].id)
  const [voteTallies, setVoteTallies] = useState<Record<string, number>>(
    Object.fromEntries(artists.map((artist) => [artist.id, artist.votes]))
  )
  const [votedArtistId, setVotedArtistId] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState(
    'Get campaign drops, artist reveals, and showcase reminders.'
  )
  const [shareMessage, setShareMessage] = useState(
    'Share Future Sound Afrobeats with your crew and grow the next wave.'
  )

  useEffect(() => {
    setTimeRemaining(getTimeRemaining())

    const timer = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const totalVotes = useMemo(
    () => Object.values(voteTallies).reduce((sum, value) => sum + value, 0),
    [voteTallies]
  )

  const topArtist = useMemo(() => {
    return artists.reduce((leader, artist) => {
      return voteTallies[artist.id] > voteTallies[leader.id] ? artist : leader
    }, artists[0])
  }, [voteTallies])

  const handleVote = (artistId: string) => {
    if (votedArtistId) return

    setVoteTallies((current) => ({
      ...current,
      [artistId]: current[artistId] + 1,
    }))
    setVotedArtistId(artistId)
  }

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailPattern = /\S+@\S+\.\S+/
    if (!emailPattern.test(newsletterEmail)) {
      setNewsletterMessage('Enter a valid email to unlock artist drops and reminders.')
      return
    }

    setNewsletterMessage(
      `You are in. ${newsletterEmail} will receive showcase drops, voting updates, and launch news.`
    )
    setNewsletterEmail('')
  }

  const shareCampaign = async (channel: 'copy' | 'x' | 'whatsapp') => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText =
      'Discover the next generation of Afrobeats talent on Future Sound Afrobeats.'

    if (channel === 'copy') {
      try {
        await navigator.clipboard.writeText(pageUrl)
        setShareMessage('Campaign link copied. Send it to your group chat and build the buzz.')
      } catch {
        setShareMessage('Copy did not work here. Use the browser URL to share the campaign.')
      }
      return
    }

    const targetUrl =
      channel === 'x'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `${shareText} ${pageUrl}`
          )}`
        : `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`

    window.open(targetUrl, '_blank', 'noopener,noreferrer')
    setShareMessage(`Opening ${channel === 'x' ? 'X' : 'WhatsApp'} to share the campaign.`)
  }

  return (
    <main className='bg-[#050816] text-white'>
      <section className='relative overflow-hidden border-b border-white/10 pt-36 pb-18 sm:pt-40'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.18),_transparent_24%),linear-gradient(180deg,_rgba(9,11,27,0.2),_rgba(5,8,22,1))]' />
        <div className='absolute left-0 top-24 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl' />
        <div className='absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl' />
        <div className='container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]'>
            <div>
              <span className='inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm tracking-[0.24em] uppercase text-white/75'>
                Premium Digital Campaign Microsite
              </span>
              <h1 className='mt-6 max-w-5xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl'>
                Future Sound Afrobeats spotlights the next generation of artists shaping the sound of tomorrow.
              </h1>
              <p className='mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl'>
                A fictional music platform campaign built to drive artist discovery, fan engagement,
                and community participation through immersive storytelling, voting, previews, and
                live event anticipation.
              </p>
              <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='#artists'
                  className='inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-200'>
                  Explore Artists
                </Link>
                <Link
                  href='#vote'
                  className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10'>
                  Vote For The Live Showcase
                </Link>
              </div>
              <div className='mt-10 grid gap-4 sm:grid-cols-3'>
                <div className='rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Artist Discovery</p>
                  <p className='mt-3 text-3xl font-semibold text-white'>4 featured acts</p>
                  <p className='mt-2 text-sm text-slate-400'>Emerging voices from key Afrobeats scenes.</p>
                </div>
                <div className='rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Community Signals</p>
                  <p className='mt-3 text-3xl font-semibold text-white'>{totalVotes.toLocaleString()}</p>
                  <p className='mt-2 text-sm text-slate-400'>Live fan votes shaping the showcase lineup.</p>
                </div>
                <div className='rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Showcase Event</p>
                  <p className='mt-3 text-3xl font-semibold text-white'>18 Sep 2026</p>
                  <p className='mt-2 text-sm text-slate-400'>Hybrid livestream and cultural community night.</p>
                </div>
              </div>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-fuchsia-950/20 backdrop-blur'>
              <div className='rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm uppercase tracking-[0.18em] text-fuchsia-300'>Live Showcase Countdown</p>
                    <h2 className='mt-3 text-3xl font-semibold text-white'>Future Sound Live: Lagos Warehouse Sessions</h2>
                  </div>
                  <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300'>
                    RSVP Open
                  </span>
                </div>
                <div className='mt-8 grid grid-cols-4 gap-3'>
                  {Object.entries(timeRemaining).map(([label, value]) => (
                    <div
                      key={label}
                      className='rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center'>
                      <p className='text-3xl font-semibold text-white sm:text-4xl'>{value}</p>
                      <p className='mt-2 text-xs uppercase tracking-[0.2em] text-slate-400'>{label}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-white/8 to-white/3 p-5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Campaign Hook</p>
                      <p className='mt-3 text-xl font-medium text-white'>
                        Fans unlock the final setlist by voting for the artist they want to see on stage.
                      </p>
                    </div>
                    <div className='rounded-2xl bg-white/6 px-4 py-3 text-right'>
                      <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Top voted</p>
                      <p className='mt-2 text-lg font-semibold text-white'>{topArtist.name}</p>
                    </div>
                  </div>
                </div>
                <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Audience promise</p>
                    <p className='mt-3 text-base leading-7 text-slate-300'>
                      Discover unreleased talent, preview tracks, vote in real time, and join a music-first community with cultural credibility.
                    </p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Creative direction</p>
                    <p className='mt-3 text-base leading-7 text-slate-300'>
                      Editorial layouts, neon gradients, glass surfaces, and mobile-first momentum inspired by premium agency campaign work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='artists' className='border-b border-white/10 py-18'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm uppercase tracking-[0.24em] text-fuchsia-300'>Artist Showcase</p>
              <h2 className='mt-4 text-4xl font-semibold text-white sm:text-5xl'>
                New talent packaged like a premium release drop.
              </h2>
              <p className='mt-4 text-lg leading-8 text-slate-300'>
                Each artist card combines sonic identity, cultural context, and a quick preview mechanic to support fast discovery and stronger consideration.
              </p>
            </div>
            <div className='rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300'>
              Scroll, preview, vote, and share in under 90 seconds.
            </div>
          </div>

          <div className='mt-10 grid gap-6 xl:grid-cols-2'>
            {artists.map((artist, index) => {
              const isActive = activePreview === artist.id
              const voteShare = Math.round((voteTallies[artist.id] / totalVotes) * 100)

              return (
                <article
                  key={artist.id}
                  className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${artist.accent} p-[1px]`}>
                  <div className='h-full rounded-[calc(2rem-1px)] bg-[#091022] p-6'>
                    <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
                      <div className='max-w-xl'>
                        <div className='flex flex-wrap items-center gap-3 text-sm text-slate-300'>
                          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
                            #{index + 1} shortlisted act
                          </span>
                          <span>{artist.city}</span>
                        </div>
                        <h3 className='mt-4 text-3xl font-semibold text-white'>{artist.name}</h3>
                        <p className='mt-2 text-base text-fuchsia-200'>{artist.sound}</p>
                        <p className='mt-4 max-w-lg text-base leading-7 text-slate-300'>{artist.highlight}</p>
                      </div>
                      <div className='rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left md:min-w-48'>
                        <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Preview track</p>
                        <p className='mt-3 text-xl font-semibold text-white'>{artist.stage}</p>
                        <p className='mt-2 text-sm text-slate-400'>{artist.previewLength} editorial cut</p>
                      </div>
                    </div>

                    <div className='mt-6 flex flex-wrap gap-3'>
                      {artist.mood.map((item) => (
                        <span
                          key={item}
                          className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300'>
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className='mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end'>
                      <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
                        <div className='flex items-center justify-between gap-4'>
                          <div>
                            <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Audio preview</p>
                            <p className='mt-2 text-base text-white'>
                              {isActive
                                ? 'Preview live. Fans are hearing the hook and groove build.'
                                : 'Tap preview to simulate a featured 30-second campaign clip.'}
                            </p>
                          </div>
                          <button
                            type='button'
                            onClick={() =>
                              setActivePreview((current) => (current === artist.id ? '' : artist.id))
                            }
                            className='rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-200'>
                            {isActive ? 'Pause Preview' : 'Play Preview'}
                          </button>
                        </div>
                        <div className='mt-5 h-2 overflow-hidden rounded-full bg-white/10'>
                          <div
                            className={`h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-orange-300 to-cyan-300 transition-all duration-700 ${
                              isActive ? 'w-3/4' : 'w-1/4'
                            }`}
                          />
                        </div>
                      </div>

                      <div className='rounded-3xl border border-white/10 bg-white/5 px-5 py-4 lg:min-w-52'>
                        <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Current vote share</p>
                        <p className='mt-3 text-3xl font-semibold text-white'>{voteShare}%</p>
                        <p className='mt-2 text-sm text-slate-400'>
                          {voteTallies[artist.id].toLocaleString()} fan votes
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id='vote' className='border-b border-white/10 py-18'>
        <div className='container mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8'>
          <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
            <p className='text-sm uppercase tracking-[0.24em] text-cyan-300'>Fan Voting System</p>
            <h2 className='mt-4 text-4xl font-semibold text-white'>Give the community a meaningful role in the campaign.</h2>
            <p className='mt-4 text-lg leading-8 text-slate-300'>
              Fans can back one artist for the live showcase spotlight. This creates a clear participation loop and gives every preview a conversion goal.
            </p>
            <div className='mt-8 space-y-4'>
              {artists.map((artist) => {
                const isVoted = votedArtistId === artist.id
                const isLocked = Boolean(votedArtistId) && !isVoted
                return (
                  <div
                    key={artist.id}
                    className='rounded-3xl border border-white/10 bg-[#0c1327] p-5'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <p className='text-xl font-semibold text-white'>{artist.name}</p>
                        <p className='mt-1 text-sm text-slate-400'>{artist.city}</p>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='text-right'>
                          <p className='text-sm text-slate-400'>Votes</p>
                          <p className='text-lg font-semibold text-white'>
                            {voteTallies[artist.id].toLocaleString()}
                          </p>
                        </div>
                        <button
                          type='button'
                          onClick={() => handleVote(artist.id)}
                          disabled={Boolean(votedArtistId)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            isVoted
                              ? 'bg-emerald-300 text-slate-950'
                              : isLocked
                                ? 'cursor-not-allowed bg-white/10 text-slate-500'
                                : 'bg-white text-slate-950 hover:bg-cyan-200'
                          }`}>
                          {isVoted ? 'Vote Counted' : 'Vote'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className='mt-6 text-sm leading-7 text-slate-400'>
              {votedArtistId
                ? 'Vote captured. The fan has completed a high-intent action and can now be pushed toward sharing or signup.'
                : 'The voting mechanic keeps the campaign feeling live, communal, and outcome-driven.'}
            </p>
          </div>

          <div className='grid gap-6'>
            <div className='rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/12 to-cyan-400/10 p-7'>
              <p className='text-sm uppercase tracking-[0.24em] text-fuchsia-300'>Social Sharing Mechanics</p>
              <h3 className='mt-4 text-3xl font-semibold text-white'>Turn excitement into distribution.</h3>
              <p className='mt-4 text-base leading-8 text-slate-300'>
                Build lightweight share actions directly into the campaign loop so fans can champion their favorite artist without friction.
              </p>
              <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
                <button
                  type='button'
                  onClick={() => shareCampaign('copy')}
                  className='rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-200'>
                  Copy Campaign Link
                </button>
                <button
                  type='button'
                  onClick={() => shareCampaign('x')}
                  className='rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
                  Share On X
                </button>
                <button
                  type='button'
                  onClick={() => shareCampaign('whatsapp')}
                  className='rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
                  Share On WhatsApp
                </button>
              </div>
              <p className='mt-5 text-sm text-slate-400'>{shareMessage}</p>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
              <p className='text-sm uppercase tracking-[0.24em] text-amber-300'>Engagement Flow</p>
              <div className='mt-6 grid gap-4 md:grid-cols-3'>
                <div className='rounded-3xl border border-white/10 bg-[#0c1327] p-5'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Step 1</p>
                  <p className='mt-3 text-xl font-semibold text-white'>Feel the campaign</p>
                  <p className='mt-3 text-sm leading-7 text-slate-400'>
                    Hero content sets the tone and communicates why the showcase matters.
                  </p>
                </div>
                <div className='rounded-3xl border border-white/10 bg-[#0c1327] p-5'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Step 2</p>
                  <p className='mt-3 text-xl font-semibold text-white'>Sample the talent</p>
                  <p className='mt-3 text-sm leading-7 text-slate-400'>
                    Preview cards reduce the distance between curiosity and emotional connection.
                  </p>
                </div>
                <div className='rounded-3xl border border-white/10 bg-[#0c1327] p-5'>
                  <p className='text-sm uppercase tracking-[0.18em] text-slate-400'>Step 3</p>
                  <p className='mt-3 text-xl font-semibold text-white'>Act and advocate</p>
                  <p className='mt-3 text-sm leading-7 text-slate-400'>
                    Voting, sharing, and signup mechanics convert attention into participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id='stories' className='border-b border-white/10 py-18'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm uppercase tracking-[0.24em] text-emerald-300'>Featured Stories</p>
              <h2 className='mt-4 text-4xl font-semibold text-white sm:text-5xl'>
                Present the campaign like a real creative case study.
              </h2>
              <p className='mt-4 text-lg leading-8 text-slate-300'>
                The editorial layer explains not just what users see, but why each interaction exists and what behavior it is meant to unlock.
              </p>
            </div>
          </div>

          <div className='mt-10 grid gap-6 lg:grid-cols-3'>
            {stories.map((story) => (
              <article
                key={story.title}
                className='rounded-[2rem] border border-white/10 bg-white/5 p-6'>
                <span className='inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300'>
                  {story.tag}
                </span>
                <h3 className='mt-5 text-2xl font-semibold text-white'>{story.title}</h3>
                <p className='mt-4 text-base leading-8 text-slate-300'>{story.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id='case-study' className='border-b border-white/10 py-18'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <p className='text-sm uppercase tracking-[0.24em] text-fuchsia-300'>Campaign Case Study</p>
            <h2 className='mt-4 text-4xl font-semibold text-white sm:text-5xl'>
              A strategic launch experience designed for discovery, advocacy, and return visits.
            </h2>
            <p className='mt-4 text-lg leading-8 text-slate-300'>
              This concept frames the microsite as a premium digital campaign hub for a fictional music platform, balancing cultural relevance with clear commercial UX goals.
            </p>
          </div>

          <div className='mt-10 grid gap-6 lg:grid-cols-2'>
            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
              <h3 className='text-2xl font-semibold text-white'>Objectives</h3>
              <ul className='mt-5 space-y-4 text-base leading-8 text-slate-300'>
                {objectives.map((item) => (
                  <li key={item} className='rounded-2xl border border-white/10 bg-[#0c1327] px-5 py-4'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
              <h3 className='text-2xl font-semibold text-white'>Audience</h3>
              <ul className='mt-5 space-y-4 text-base leading-8 text-slate-300'>
                {audience.map((item) => (
                  <li key={item} className='rounded-2xl border border-white/10 bg-[#0c1327] px-5 py-4'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
              <h3 className='text-2xl font-semibold text-white'>Strategy</h3>
              <ul className='mt-5 space-y-4 text-base leading-8 text-slate-300'>
                {strategy.map((item) => (
                  <li key={item} className='rounded-2xl border border-white/10 bg-[#0c1327] px-5 py-4'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-7'>
              <h3 className='text-2xl font-semibold text-white'>User Flow</h3>
              <ul className='mt-5 space-y-4 text-base leading-8 text-slate-300'>
                {userFlow.map((item) => (
                  <li key={item} className='rounded-2xl border border-white/10 bg-[#0c1327] px-5 py-4'>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='mt-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 to-cyan-400/10 p-7'>
            <h3 className='text-2xl font-semibold text-white'>Expected Campaign Outcomes</h3>
            <div className='mt-5 grid gap-4 lg:grid-cols-3'>
              {outcomes.map((item) => (
                <div
                  key={item}
                  className='rounded-3xl border border-white/10 bg-[#0c1327] px-5 py-5 text-base leading-8 text-slate-300'>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id='join' className='py-18'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-7 sm:p-10'>
            <div className='grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center'>
              <div>
                <p className='text-sm uppercase tracking-[0.24em] text-cyan-300'>Newsletter Signup</p>
                <h2 className='mt-4 text-4xl font-semibold text-white sm:text-5xl'>
                  Keep fans close with drops, reminders, and artist story reveals.
                </h2>
                <p className='mt-4 max-w-2xl text-lg leading-8 text-slate-300'>
                  The newsletter CTA closes the loop for visitors who are not ready to vote or share yet, giving the campaign a durable retention mechanic beyond the first session.
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                className='rounded-[1.5rem] border border-white/10 bg-[#0c1327] p-6'>
                <label htmlFor='newsletter-email' className='text-sm uppercase tracking-[0.18em] text-slate-400'>
                  Join the Future Sound list
                </label>
                <input
                  id='newsletter-email'
                  type='email'
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder='you@example.com'
                  className='mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300'
                />
                <button
                  type='submit'
                  className='mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200'>
                  Subscribe For Campaign Drops
                </button>
                <p className='mt-4 text-sm leading-7 text-slate-400'>{newsletterMessage}</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FutureSoundMicrosite

'use client'

import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function getTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  }
}

const Countdown = ({ targetIso }: { targetIso: string | null }) => {
  const target = targetIso ? new Date(targetIso).getTime() : null
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    target ? getTimeLeft(target) : { days: 0, hours: 0, minutes: 0, seconds: 0, done: false },
  )

  useEffect(() => {
    if (!target) return
    setTimeLeft(getTimeLeft(target))
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!targetIso) {
    return <p className='text-center text-slate-400'>Loading event date…</p>
  }

  if (timeLeft.done) {
    return (
      <p className='text-center text-3xl font-bold text-fuchsia-300'>
        The Future Sound is live now 🔊
      </p>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className='flex flex-wrap items-stretch justify-center gap-3 sm:gap-5'>
      {units.map((unit) => (
        <div
          key={unit.label}
          className='flex min-w-[76px] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:min-w-[104px] sm:px-6'>
          <span className='text-4xl font-extrabold tabular-nums text-white sm:text-6xl'>
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className='mt-1 text-[11px] uppercase tracking-[0.2em] text-fuchsia-300 sm:text-sm'>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Countdown

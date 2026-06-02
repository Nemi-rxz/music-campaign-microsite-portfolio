import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/' className='inline-flex items-center gap-3 text-white'>
      <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold tracking-[0.2em] text-slate-950'>
        FS
      </span>
      <span className='flex flex-col'>
        <span className='text-lg font-semibold leading-none sm:text-xl'>Future Sound</span>
        <span className='mt-1 text-[11px] uppercase tracking-[0.28em] text-white/60'>
          Afrobeats
        </span>
      </span>
    </Link>
  )
}

export default Logo

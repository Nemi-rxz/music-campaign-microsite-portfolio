import Link from 'next/link'

const footerSections = [
  {
    title: 'Campaign',
    links: [
      { label: 'Artist showcase', href: '#artists' },
      { label: 'Fan voting', href: '#vote' },
      { label: 'Featured stories', href: '#stories' },
    ],
  },
  {
    title: 'Strategy',
    links: [
      { label: 'Objectives', href: '#case-study' },
      { label: 'Audience', href: '#case-study' },
      { label: 'User flow', href: '#case-study' },
    ],
  },
  {
    title: 'Engage',
    links: [
      { label: 'Join newsletter', href: '#join' },
      { label: 'Share campaign', href: '#vote' },
      { label: 'Live countdown', href: '#artists' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className='border-t border-white/10 bg-[#030611]'>
      <div className='container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='max-w-2xl'>
            <p className='text-sm uppercase tracking-[0.24em] text-fuchsia-300'>Future Sound Afrobeats</p>
            <h4 className='mt-4 text-3xl font-semibold text-white sm:text-4xl'>
              A premium campaign microsite concept for discovering the next generation of Afrobeats talent.
            </h4>
            <p className='mt-5 max-w-xl text-base leading-8 text-slate-400'>
              Built as a commercial-quality case study experience with clear audience strategy, fan engagement loops, and culturally relevant storytelling.
            </p>
            <div className='mt-6 flex flex-wrap gap-3 text-sm text-slate-300'>
              <span className='rounded-full border border-white/10 bg-white/5 px-4 py-2'>
                Artist discovery
              </span>
              <span className='rounded-full border border-white/10 bg-white/5 px-4 py-2'>
                Fan engagement
              </span>
              <span className='rounded-full border border-white/10 bg-white/5 px-4 py-2'>
                Community participation
              </span>
              </div>
            </div>

          <div className='grid gap-8 sm:grid-cols-3'>
            {footerSections.map((section) => (
              <div key={section.title}>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/65'>
                  {section.title}
                </p>
                <ul className='mt-5 space-y-4'>
                  {section.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className='text-base text-slate-300 transition hover:text-white'>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between'>
          <p>© 2026 Future Sound Afrobeats. Fictional campaign concept for portfolio-style presentation.</p>
          <div className='flex flex-wrap gap-5'>
            <Link href='#case-study' className='transition hover:text-white'>
              Campaign case study
            </Link>
            <Link href='#join' className='transition hover:text-white'>
              Newsletter signup
            </Link>
            <Link href='#vote' className='transition hover:text-white'>
              Community vote
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

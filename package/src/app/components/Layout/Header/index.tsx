'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

const navigation = [
  { label: 'Live Poll', href: '#vote' },
]

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden'
      return
    }
    document.body.style.overflow = ''
  }, [navbarOpen])

  return (
    <header
      className={`fixed top-0 z-40 w-full border-b transition-all duration-300 ${
        sticky
          ? 'border-white/10 bg-slate-950/90 shadow-2xl shadow-black/20 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div
          className={`flex items-center justify-between duration-300 ${
            sticky ? 'py-4' : 'py-6'
          }`}>
          <div className='shrink-0'>
            <Logo />
          </div>
          <nav className='hidden items-center gap-8 lg:flex'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='text-sm font-medium text-white/72 transition hover:text-white'>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className='flex items-center gap-3'>
            <Link
              href='#vote'
              className='hidden rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-200 lg:inline-flex'>
              Fan Vote
            </Link>
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden'
              aria-label='Toggle mobile menu'>
              <span className='block h-0.5 w-5 bg-white'></span>
              <span className='mt-1.5 block h-0.5 w-5 bg-white'></span>
              <span className='mt-1.5 block h-0.5 w-5 bg-white'></span>
            </button>
          </div>
        </div>

        {navbarOpen && <div className='fixed inset-0 z-40 bg-black/60 lg:hidden' onClick={() => setNavbarOpen(false)} />}
        <div
          className={`fixed right-0 top-0 z-50 h-full w-full max-w-xs transform border-l border-white/10 bg-slate-950 px-6 py-6 shadow-2xl transition-transform duration-300 lg:hidden ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className='flex items-center justify-between'>
            <Logo />
            <button
              onClick={() => setNavbarOpen(false)}
              className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl text-white'
              aria-label='Close mobile menu'>
              ×
            </button>
          </div>
          <nav className='mt-10 flex flex-col gap-4'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base font-medium text-white transition hover:bg-white/10'
                onClick={() => {
                  setNavbarOpen(false)
                }}>
                {item.label}
              </Link>
            ))}
            <div className='mt-4 grid gap-3'>
              <Link
                href='#vote'
                className='inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950'
                onClick={() => setNavbarOpen(false)}>
                Fan Vote
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

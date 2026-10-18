import { Metadata } from 'next'
import FutureSoundMicrosite from '@/app/components/Home/FutureSoundMicrosite'

export const metadata: Metadata = {
  title: 'Music Campaign | Discover, Stream & Own',
  description:
    'An interactive and gamified music platform where you can discover tracks, follow artists, earn points, unlock badges, and own the music you love.',
  keywords: [
    'music streaming',
    'artist discovery',
    'music platform',
    'gamified music',
    'buy music',
    'music community',
  ],
  openGraph: {
    title: 'Music Campaign',
    description:
      'Discover amazing music, earn rewards, and join a community of music lovers. Interactive, fun, and self-explanatory.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <FutureSoundMicrosite />
  )
}

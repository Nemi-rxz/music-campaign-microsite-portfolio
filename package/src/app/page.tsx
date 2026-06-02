import { Metadata } from 'next'
import FutureSoundMicrosite from '@/app/components/Home/FutureSoundMicrosite'

export const metadata: Metadata = {
  title: 'Future Sound Afrobeats | Premium Artist Discovery Campaign',
  description:
    'A premium digital campaign microsite for Future Sound Afrobeats, designed to drive artist discovery, fan engagement, voting, social sharing, and live event participation.',
  keywords: [
    'Future Sound Afrobeats',
    'Afrobeats campaign',
    'music microsite',
    'artist discovery',
    'fan engagement',
    'music case study',
  ],
  openGraph: {
    title: 'Future Sound Afrobeats',
    description:
      'Explore the next generation of Afrobeats talent through previews, voting, live showcase countdowns, featured stories, and premium campaign storytelling.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <FutureSoundMicrosite />
  )
}

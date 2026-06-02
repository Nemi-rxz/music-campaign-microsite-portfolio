import { Documentation } from '@/app/components/Documentation/Documentation'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Campaign Documentation | Future Sound Afrobeats',
}

export default function Page() {
  return (
    <>
      <Documentation />
    </>
  )
}

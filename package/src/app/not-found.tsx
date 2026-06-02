import HeroSub from '@/app/components/SharedComponent/HeroSub'
import NotFound from '@/app/components/NotFound'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Future Sound Afrobeats',
}

const ErrorPage = () => {
  return (
    <>
      <HeroSub title='404' />
      <NotFound />
    </>
  )
}

export default ErrorPage

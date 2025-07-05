import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import ActiveTournaments from '@/components/sections/ActiveTournaments'
import Stats from '@/components/sections/Stats'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <ActiveTournaments />
      <Stats />
    </div>
  )
}

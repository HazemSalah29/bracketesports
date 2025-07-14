export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            About Bracket Esports
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            We&apos;re building the future of competitive gaming, one tournament at a time.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          <div className="flex gap-x-4 rounded-xl bg-slate-800 p-6">
            <div className="text-base leading-7">
              <h3 className="font-semibold text-white">Our Mission</h3>
              <p className="mt-2 text-slate-300">
                To create a premier esports platform that connects gamers worldwide, 
                providing fair competition and rewarding skill-based gameplay.
              </p>
            </div>
          </div>
          
          <div className="flex gap-x-4 rounded-xl bg-slate-800 p-6">
            <div className="text-base leading-7">
              <h3 className="font-semibold text-white">Our Vision</h3>
              <p className="mt-2 text-slate-300">
                To become the go-to platform for competitive gaming, where every 
                player has the opportunity to showcase their skills and compete at the highest level.
              </p>
            </div>
          </div>
          
          <div className="flex gap-x-4 rounded-xl bg-slate-800 p-6">
            <div className="text-base leading-7">
              <h3 className="font-semibold text-white">Our Values</h3>
              <p className="mt-2 text-slate-300">
                Fair play, competitive integrity, community building, and 
                continuous innovation in the esports ecosystem.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose Bracket Esports?
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 text-base leading-7 text-slate-300 lg:grid-cols-2">
            <div>
              <p>
                <strong className="font-semibold text-white">Riot Games Integration:</strong> 
                {' '}Automatic account verification and real match data integration for Valorant and League of Legends.
              </p>
              <p className="mt-4">
                <strong className="font-semibold text-white">Fair Competition:</strong> 
                {' '}Skill-based matchmaking and transparent ranking systems ensure fair play for all participants.
              </p>
            </div>
            <div>
              <p>
                <strong className="font-semibold text-white">Real Rewards:</strong> 
                {' '}Compete for real prizes, rankings, and recognition in the gaming community.
              </p>
              <p className="mt-4">
                <strong className="font-semibold text-white">24/7 Support:</strong> 
                {' '}Our dedicated team ensures tournaments run smoothly and players have the best experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

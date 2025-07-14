const stats = [
  { name: 'Total Points Awarded', value: '2.8M+' },
  { name: 'Active Monthly Players', value: '15,000+' },
  { name: 'Tournaments Completed', value: '2,500+' },
  { name: 'Average Tournament Points', value: '150' },
]

export default function Stats() {
  return (
    <div className="py-24 sm:py-32 bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-gaming-500">Platform Stats</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-gaming">
            Join Thousands of Winners
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Our platform has awarded millions of points to skilled gamers worldwide.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col items-center text-center">
                <dt className="text-sm font-semibold leading-6 text-slate-300">{stat.name}</dt>
                <dd className="mt-2 text-4xl font-bold leading-9 tracking-tight text-white font-gaming">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

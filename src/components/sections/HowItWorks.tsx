const steps = [
  {
    id: '01',
    name: 'Create Account',
    description: 'Sign up with your email and verify your identity for secure gameplay.',
    status: 'complete',
  },
  {
    id: '02',
    name: 'Link Gaming Accounts',
    description: 'Connect your Steam, Epic Games, or other gaming platform accounts.',
    status: 'complete',
  },
  {
    id: '03',
    name: 'Join Tournament',
    description: 'Browse active tournaments and pay the entry fee to join.',
    status: 'complete',
  },
  {
    id: '04',
    name: 'Compete & Win',
    description: 'Play your matches and climb the bracket to claim prize money.',
    status: 'current',
  },
]

export default function HowItWorks() {
  return (
    <div className="py-24 sm:py-32 bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-gaming-500">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-gaming">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Get started in just a few steps and start earning from your gaming skills today.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="md:flex-1">
                  <div className="group pl-4 py-2 flex flex-col border-l-4 border-gaming-500 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gaming-500 transition-colors">
                      Step {step.id}
                    </span>
                    <span className="text-lg font-semibold text-white">{step.name}</span>
                    <span className="text-sm text-slate-400">{step.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}

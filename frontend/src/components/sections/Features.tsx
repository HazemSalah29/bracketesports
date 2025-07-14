import {
  UserPlusIcon,
  StarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Play with Creators',
    description:
      'Join exclusive tournaments hosted by verified gaming creators and streamers.',
    icon: StarIcon,
  },
  {
    name: 'Bracket Coins',
    description:
      'Purchase coins to enter premium tournaments and unlock exclusive experiences.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Creator Tournaments',
    description:
      'Compete in unique tournament formats designed by your favorite content creators.',
    icon: TrophyIcon,
  },
  {
    name: 'Premium Experiences',
    description:
      'Win 1-on-1 coaching sessions, Discord access, and personalized content from creators.',
    icon: SparklesIcon,
  },
  {
    name: 'Amazing Prizes',
    description:
      'Earn coin rewards, cash prizes, merchandise, and exclusive creator collaborations.',
    icon: GiftIcon,
  },
  {
    name: 'Easy Registration',
    description:
      'Quick sign-up process with game account verification for fair competition.',
    icon: UserPlusIcon,
  },
];

export default function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-gaming-500">
            Everything You Need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-gaming">
            Why Choose Bracket Esports?
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Our platform combines cutting-edge technology with fair competition
            to create the ultimate esports tournament experience.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gaming-600 gaming-card neon-glow">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-300">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

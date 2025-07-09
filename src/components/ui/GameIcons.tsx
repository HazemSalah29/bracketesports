import Image from 'next/image'

// Game icon mapping
export const gameIcons = {
  valorant: '/images/valorantPngLogo.png',
  'league-of-legends': '/images/leagueOfLegendsIcon.png',
  lol: '/images/leagueOfLegendsIcon.png',
  cs2: '🎯',
  'rocket-league': '🚗',
  dota2: '🛡️',
  fortnite: '🏗️',
  apex: '🎯',
  overwatch2: '🎮',
} as const

export const gameLogos = {
  valorant: '/images/Valorant-LogoWithText.png',
  'league-of-legends': '/images/League-of-Legends-LogoWithText.png',
  lol: '/images/League-of-Legends-LogoWithText.png',
} as const

// Helper component for game icons
interface GameIconProps {
  gameId: string
  size?: number
  className?: string
  useEmoji?: boolean
}

export function GameIcon({ gameId, size = 24, className = '', useEmoji = false }: GameIconProps) {
  const iconPath = gameIcons[gameId as keyof typeof gameIcons]
  
  // If useEmoji is explicitly true, render as emoji
  if (useEmoji) {
    return (
      <span className={`text-${size === 24 ? 'xl' : size === 32 ? '2xl' : 'lg'} ${className}`}>
        {typeof iconPath === 'string' && iconPath.length <= 2 ? iconPath : '🎮'}
      </span>
    )
  }
  
  // If no icon path found, fallback to emoji
  if (!iconPath) {
    return (
      <span className={`text-${size === 24 ? 'xl' : size === 32 ? '2xl' : 'lg'} ${className}`}>
        🎮
      </span>
    )
  }
  
  // If it's an emoji (short string), render as text
  if (typeof iconPath === 'string' && iconPath.length <= 2) {
    return (
      <span className={`text-${size === 24 ? 'xl' : size === 32 ? '2xl' : 'lg'} ${className}`}>
        {iconPath}
      </span>
    )
  }
  
  // If it's an image path, render as Next.js Image
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Image
        src={iconPath}
        alt={`${gameId} icon`}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          console.error(`Failed to load image: ${iconPath}`)
        }}
      />
    </div>
  )
}

// Helper component for game logos (with text)
interface GameLogoProps {
  gameId: string
  width?: number
  height?: number
  className?: string
}

export function GameLogo({ gameId, width = 120, height = 40, className = '' }: GameLogoProps) {
  const logoPath = gameLogos[gameId as keyof typeof gameLogos]
  
  if (!logoPath) {
    return <span className={className}>{gameId}</span>
  }
  
  return (
    <div className={className} style={{ width, height }}>
      <Image
        src={logoPath}
        alt={`${gameId} logo`}
        width={width}
        height={height}
        className="object-contain"
        onError={(e) => {
          console.error(`Failed to load logo: ${logoPath}`)
          // Fallback to text on error
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          target.parentElement!.innerHTML = gameId
        }}
      />
    </div>
  )
}

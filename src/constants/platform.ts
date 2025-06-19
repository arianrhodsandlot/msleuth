export type PlatformName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'atarilynx'
  | 'famicom'
  | 'fds'
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'genesis'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'sega32x'
  | 'sfc'
  | 'sg-1000'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'wonderswan'
  | 'wonderswancolor'

export interface Platform {
  launchboxName: string
  libretroName: string
  name: PlatformName
}

export const platforms: Platform[] = [
  {
    launchboxName: 'Arcade',
    libretroName: 'MAME',
    name: 'arcade',
  },
  {
    launchboxName: 'Atari 2600',
    libretroName: 'Atari - 2600',
    name: 'atari2600',
  },
  {
    launchboxName: 'Atari 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    launchboxName: 'Atari 7800',
    libretroName: 'Atari - 7800',
    name: 'atari7800',
  },
  {
    launchboxName: 'Atari Lynx',
    libretroName: 'Atari - Lynx',
    name: 'atarilynx',
  },
  {
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'famicom',
  },
  {
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  {
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'genesis',
  },
  {
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'megadrive',
  },
  {
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'nes',
  },
  {
    launchboxName: 'SNK Neo Geo Pocket',
    libretroName: 'SNK - Neo Geo Pocket',
    name: 'ngp',
  },
  {
    launchboxName: 'SNK Neo Geo Pocket Color',
    libretroName: 'SNK - Neo Geo Pocket Color',
    name: 'ngpc',
  },
  {
    launchboxName: 'Sega 32X',
    libretroName: 'Sega - 32X',
    name: 'sega32x',
  },
  {
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'sfc',
  },
  {
    launchboxName: 'Sega SG-1000',
    libretroName: 'Sega - SG-1000',
    name: 'sg-1000',
  },
  {
    launchboxName: 'Sega Master System',
    libretroName: 'Sega - Master System - Mark III',
    name: 'sms',
  },
  {
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'snes',
  },
  {
    launchboxName: 'Nintendo Virtual Boy',
    libretroName: 'Nintendo - Virtual Boy',
    name: 'vb',
  },
  {
    launchboxName: 'WonderSwan',
    libretroName: 'Bandai - WonderSwan',
    name: 'wonderswan',
  },
  {
    launchboxName: 'WonderSwan Color',
    libretroName: 'Bandai - WonderSwan Color',
    name: 'wonderswancolor',
  },
].filter(({ name }) => !['atari5200', 'atari7800', 'atarilynx', 'fds', 'sega32x'].includes(name)) as Platform[]

export const platformMap: Record<string, Platform> = {}
for (const platform of platforms) {
  const keys = ['name', 'libretroName', 'launchboxName']
  for (const key of keys) {
    const value = platform[key]
    platformMap[value] = platform
  }
}

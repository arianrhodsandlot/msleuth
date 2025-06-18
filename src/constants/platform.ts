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
  displayName: string
  fileExtensions: string[]
  launchboxName: string
  libretroName: string
  name: PlatformName
}

export const platforms: Platform[] = [
  {
    displayName: 'Arcade',
    fileExtensions: ['zip'].map((name) => `.${name}`),
    launchboxName: 'Arcade',
    libretroName: 'MAME',
    name: 'arcade',
  },
  {
    displayName: 'Atari 2600',
    fileExtensions: ['a26', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 2600',
    libretroName: 'Atari - 2600',
    name: 'atari2600',
  },
  {
    displayName: 'Atari 5200',
    fileExtensions: ['a52', 'xfd', 'atr', 'atx', 'cdm', 'cas', 'xex', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    displayName: 'Atari 7800',
    fileExtensions: ['a78', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 7800',
    libretroName: 'Atari - 7800',
    name: 'atari7800',
  },
  {
    displayName: 'Atari Lynx',
    fileExtensions: ['lnx', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari Lynx',
    libretroName: 'Atari - Lynx',
    name: 'atarilynx',
  },
  {
    displayName: 'Family Computer',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'famicom',
  },
  {
    displayName: 'Famicom Disk System',
    fileExtensions: ['fds', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  {
    displayName: 'Game Gear',
    fileExtensions: ['gg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    displayName: 'Game Boy',
    fileExtensions: ['gb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    displayName: 'Game Boy Advance',
    fileExtensions: ['gba', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    displayName: 'Game Boy Color',
    fileExtensions: ['gb', 'gbc', 'cgb', 'sgb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    displayName: 'Genesis',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'genesis',
  },
  {
    displayName: 'Megadrive',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'megadrive',
  },
  {
    displayName: 'NES',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'nes',
  },
  {
    displayName: 'Neo Geo Pocket',
    fileExtensions: ['ngp', 'zip'].map((name) => `.${name}`),
    launchboxName: 'SNK Neo Geo Pocket',
    libretroName: 'SNK - Neo Geo Pocket',
    name: 'ngp',
  },
  {
    displayName: 'Neo Geo Pocket Color',
    fileExtensions: ['ngc', 'zip'].map((name) => `.${name}`),
    launchboxName: 'SNK Neo Geo Pocket Color',
    libretroName: 'SNK - Neo Geo Pocket Color',
    name: 'ngpc',
  },
  {
    displayName: 'Sega 32X',
    fileExtensions: ['32x', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega 32X',
    libretroName: 'Sega - 32X',
    name: 'sega32x',
  },
  {
    displayName: 'Super Famicom',
    fileExtensions: ['smc', 'sfc', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'sfc',
  },
  {
    displayName: 'Sega SG-1000',
    fileExtensions: ['sg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega SG-1000',
    libretroName: 'Sega - SG-1000',
    name: 'sg-1000',
  },
  {
    displayName: 'Master System',
    fileExtensions: ['sms', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Master System',
    libretroName: 'Sega - Master System - Mark III',
    name: 'sms',
  },
  {
    displayName: 'Super NES',
    fileExtensions: ['smc', 'sfc', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'snes',
  },
  {
    displayName: 'Virtual Boy',
    fileExtensions: ['vb', 'vboy', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Virtual Boy',
    libretroName: 'Nintendo - Virtual Boy',
    name: 'vb',
  },
  {
    displayName: 'WonderSwan',
    fileExtensions: ['ws', 'zip'].map((name) => `.${name}`),
    launchboxName: 'WonderSwan',
    libretroName: 'Bandai - WonderSwan',
    name: 'wonderswan',
  },
  {
    displayName: 'WonderSwan Color',
    fileExtensions: ['wsc', 'zip'].map((name) => `.${name}`),
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

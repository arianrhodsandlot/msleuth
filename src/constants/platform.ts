import { mapValues } from 'es-toolkit'

interface BasePlatform {
  launchboxName: string
  libretroName: string
}

export const basePlatformMap: Record<string, BasePlatform> = {
  arcade: { launchboxName: 'Arcade', libretroName: 'MAME' },
  atari2600: { launchboxName: 'Atari 2600', libretroName: 'Atari - 2600' },
  atari5200: { launchboxName: 'Atari 5200', libretroName: 'Atari - 5200' },
  atari7800: { launchboxName: 'Atari 7800', libretroName: 'Atari - 7800' },
  atarilynx: { launchboxName: 'Atari Lynx', libretroName: 'Atari - Lynx' },
  channelf: { launchboxName: 'Fairchild Channel F', libretroName: 'Fairchild - ChannelF' },
  colecovision: { launchboxName: 'ColecoVision', libretroName: 'Coleco - ColecoVision' },
  famicom: { launchboxName: 'Nintendo Entertainment System', libretroName: 'Nintendo - Nintendo Entertainment System' },
  fds: { launchboxName: 'Nintendo Famicom Disk System', libretroName: 'Nintendo - Family Computer Disk System' },
  gameandwatch: { launchboxName: 'Nintendo Game & Watch', libretroName: 'Handheld Electronic Game' },
  gamegear: { launchboxName: 'Sega Game Gear', libretroName: 'Sega - Game Gear' },
  gb: { launchboxName: 'Nintendo Game Boy', libretroName: 'Nintendo - Game Boy' },
  gba: { launchboxName: 'Nintendo Game Boy Advance', libretroName: 'Nintendo - Game Boy Advance' },
  gbc: { launchboxName: 'Nintendo Game Boy Color', libretroName: 'Nintendo - Game Boy Color' },
  genesis: { launchboxName: 'Sega Genesis', libretroName: 'Sega - Mega Drive - Genesis' },
  megadrive: { launchboxName: 'Sega Genesis', libretroName: 'Sega - Mega Drive - Genesis' },
  msx: { launchboxName: 'Microsoft MSX', libretroName: 'Microsoft - MSX' },
  msx2: { launchboxName: 'Microsoft MSX2', libretroName: 'Microsoft - MSX2' },
  nes: { launchboxName: 'Nintendo Entertainment System', libretroName: 'Nintendo - Nintendo Entertainment System' },
  ngp: { launchboxName: 'SNK Neo Geo Pocket', libretroName: 'SNK - Neo Geo Pocket' },
  ngpc: { launchboxName: 'SNK Neo Geo Pocket Color', libretroName: 'SNK - Neo Geo Pocket Color' },
  odyssey2: { launchboxName: 'Magnavox Odyssey 2', libretroName: 'Magnavox - Odyssey2' },
  pcengine: { launchboxName: 'NEC TurboGrafx-16', libretroName: 'NEC - PC Engine - TurboGrafx 16' },
  sega32x: { launchboxName: 'Sega 32X', libretroName: 'Sega - 32X' },
  sfc: {
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
  },
  'sg-1000': { launchboxName: 'Sega SG-1000', libretroName: 'Sega - SG-1000' },
  sms: { launchboxName: 'Sega Master System', libretroName: 'Sega - Master System - Mark III' },
  snes: {
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
  },
  vb: { launchboxName: 'Nintendo Virtual Boy', libretroName: 'Nintendo - Virtual Boy' },
  videopac: { launchboxName: 'Philips Videopac+', libretroName: 'Philips - Videopac+' },
  wonderswan: { launchboxName: 'WonderSwan', libretroName: 'Bandai - WonderSwan' },
  wonderswancolor: { launchboxName: 'WonderSwan Color', libretroName: 'Bandai - WonderSwan Color' },
}

export type PlatformName = keyof typeof basePlatformMap

export interface Platform extends BasePlatform {
  name: PlatformName
}

export const platformMap: Record<PlatformName, Platform> = mapValues(
  basePlatformMap,
  (platform: BasePlatform, name: PlatformName) => ({ name, ...platform }),
)

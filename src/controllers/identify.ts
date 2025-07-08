import { getDB } from '../database/index.ts'
import { LaunchboxProvider } from '../providers/launchbox.ts'
import { LibretroProvider } from '../providers/libretro.ts'
import type { ROMFile } from '../types/file.ts'

export async function identify(platform: string, files: ROMFile[]) {
  const db = getDB()

  const libretroProvider = new LibretroProvider({ db })
  const libretroMetadataList = await libretroProvider.identify(platform, files)

  const launchboxProvider = new LaunchboxProvider({ db })
  const launchboxMetadataList = await launchboxProvider.identify(
    platform,
    files.map((file, index) => ({
      ...file,
      name: libretroMetadataList[index]?.name || file.name,
    })),
  )

  return files.map((file, index) => ({
    launchbox: launchboxMetadataList[index],
    libretro: libretroMetadataList[index],
  }))
}

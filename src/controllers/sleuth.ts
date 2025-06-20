import { getDB } from '../database/index.ts'
import { LaunchboxProvider } from '../providers/launchbox.ts'
import { LibretroProvider } from '../providers/libretro.ts'
import type { ROMFile } from '../types/file.ts'

function patchMetadataList({
  launchboxMetadataList,
  libretroMetadataList,
}: {
  launchboxMetadataList: Awaited<ReturnType<LaunchboxProvider['guess']>>
  libretroMetadataList: Awaited<ReturnType<LibretroProvider['guess']>>
}) {
  // todo: needs to be implemented
  if (!globalThis) {
    console.info(launchboxMetadataList, libretroMetadataList)
  }
}

export async function sleuth(platform: string, files: ROMFile[]) {
  const db = await getDB()

  const libretroProvider = new LibretroProvider({ db })
  const libretroMetadataList = await libretroProvider.guess(platform, files)

  const launchboxProvider = new LaunchboxProvider({ db })
  const launchboxMetadataList = await launchboxProvider.guess(
    platform,
    files.map((file, index) => ({
      ...file,
      compactName: libretroMetadataList[index]?.compactName,
      goodcodesBaseCompactName: libretroMetadataList[index]?.goodcodesBaseCompactName,
    })),
  )

  patchMetadataList({ launchboxMetadataList, libretroMetadataList })

  return files.map((file, index) => ({
    launchbox: launchboxMetadataList[index],
    libretro: libretroMetadataList[index],
  }))
}

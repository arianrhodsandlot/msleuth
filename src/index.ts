import { getDB } from "./database/index.ts"
import { LibretroProvider } from "./providers/libretro.ts"

export async function getMetaData (files) {
  const db = await getDB();
  const launchboxProvider = new LibretroProvider({ db })
  const metadataList = await launchboxProvider.guess(files)
  return metadataList;
}

const metadata = await getMetaData([{ name: 'Power Blade 2 (USA).zip', platform: 'nes' }, { name: 'River City Ransom (USA).zip', platform: 'nes' }])
// console.log(metadata)

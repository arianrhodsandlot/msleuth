import test, { describe } from 'node:test'
import { sleuth } from '../src/apis.ts'

describe('sleuth', () => {
  test('sleuth with name', async (t) => {
    const metadata = await sleuth('nes', [{ name: 'Contra (USA).zip' }, { name: 'Contra (USA) [!].zip' }])
    t.assert.partialDeepStrictEqual(metadata, [
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
    ])
  })

  test('sleuth with md5', async (t) => {
    const metadata = await sleuth('nes', [
      {
        md5: 'cdf73714ff3ef47f4eeb2b71707be2a0',
        name: 'Super Mario Bros. (USA).zip', // a wrong name
      },
    ])
    t.assert.partialDeepStrictEqual(metadata, [
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
    ])
  })
})

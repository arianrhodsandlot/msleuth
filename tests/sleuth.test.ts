import { describe, expect, test } from 'bun:test'
import { identify } from '../src/controllers/identify.ts'

describe('identify', () => {
  test('identify with name', async () => {
    const metadata = await identify('nes', [{ name: 'Contra (USA).zip' }, { name: 'Contra (USA) [!].zip' }])
    expect(metadata).toMatchObject([
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
    ])
  })

  test('identify with md5', async () => {
    const metadata = await identify('nes', [
      {
        md5: 'cdf73714ff3ef47f4eeb2b71707be2a0',
        name: 'Super Mario Bros. (USA).zip', // a wrong name
      },
    ])
    expect(metadata).toMatchObject([
      { launchbox: { databaseId: 1258 }, libretro: { id: 'cecdb9587c85bc0f0bbcac5e2046e433f9b97f92' } },
    ])
  })
})

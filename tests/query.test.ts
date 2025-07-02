import test, { describe } from 'node:test'
import { query } from '../src/apis.ts'

describe('query', () => {
  test('query', async (t) => {
    const metadata = await query([
      {
        launchboxId: 140,
        libretroId: '23a02b3f92193510329426621b8a23fd94ad886e',
      },
    ])
    t.assert.partialDeepStrictEqual(metadata, [
      {
        launchbox: { name: 'Super Mario Bros.' },
        libretro: { name: 'Super Mario Bros. (World)' },
      },
    ])
  })
})

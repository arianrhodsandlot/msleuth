import { describe, expect, test } from 'bun:test'
import { query } from '../src/controllers/query.ts'

describe('query', () => {
  test('query', async () => {
    const metadata = await query([
      {
        launchboxId: 140,
        libretroId: '23a02b3f92193510329426621b8a23fd94ad886e',
      },
    ])
    expect(metadata).toMatchObject([
      {
        launchbox: { name: 'Super Mario Bros.' },
        libretro: { name: 'Super Mario Bros. (World)' },
      },
    ])
  })
})

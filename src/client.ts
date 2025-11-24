import { hc, parseResponse } from 'hono/client'
import type { apis } from './apis.ts'

export function createClient(host = 'https://msleuth.arianrhodsandlot.workers.dev') {
  const client = hc<typeof apis>(new URL('api/v1', host).href)

  return {
    async identify(json: Parameters<typeof client.metadata.identify.$post>[0]['json']) {
      const response = await parseResponse(client.metadata.identify.$post({ json }))
      return response
    },

    async query(json: Parameters<typeof client.metadata.query.$post>[0]['json']) {
      const response = await parseResponse(client.metadata.query.$post({ json }))
      return response
    },
  }
}

export const msleuth = createClient()

import { type ClientRequestOptions, hc, parseResponse } from 'hono/client'
import type { apis } from './apis.ts'

type HC = ReturnType<typeof hc<typeof apis>>
type Query = HC['metadata']['query']['$post']
type Identify = HC['metadata']['identify']['$post']

export type IdentifyParameter = Parameters<Identify>[0]['json']
export type QueryParameter = Parameters<Query>[0]['json']

export function createClient(host = 'https://msleuth.arianrhodsandlot.workers.dev', options?: ClientRequestOptions) {
  const client = hc<typeof apis>(new URL('api/v1', host).href, options)

  return {
    async identify(json: IdentifyParameter) {
      return await parseResponse(client.metadata.identify.$post({ json }))
    },

    async query(json: QueryParameter) {
      return await parseResponse(client.metadata.query.$post({ json }))
    },
  }
}

export const msleuth = createClient()

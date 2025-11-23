import { hc, parseResponse } from 'hono/client'
import type { apis } from './apis.ts'

const client = hc<typeof apis>('/')

export async function identify(json: Parameters<typeof client.metadata.identify.$post>[0]['json']) {
  const response = await client.metadata.identify.$post({ json })
  return parseResponse(response)
}

export async function query(json: Parameters<typeof client.metadata.query.$post>[0]['json']) {
  const response = await client.metadata.query.$post({ json })
  return parseResponse(response)
}

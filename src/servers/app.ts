import { Hono } from 'hono'
import { query } from '../apis/query.ts'
import { sleuth } from '../apis/sleuth.ts'

const app = new Hono()

app.get('/query', (c) => {
  const conditions = JSON.parse(c.req.query('conditions') || '')
  const result = query(conditions)
  return c.json(result)
})

app.get('/sleuth', async (c) => {
  const platform = c.req.query('platform') || ''
  const files = JSON.parse(c.req.query('files') || '')
  const result = await sleuth(platform, files)
  return c.json(result)
})

export { app }

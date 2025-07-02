import path from 'node:path'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { renderFile } from 'pug'
import { z } from 'zod'
import { platforms } from '../constants/platform.ts'
import { query } from '../controllers/query.ts'
import { sleuth } from '../controllers/sleuth.ts'
import { safeParseJson5 } from '../utils.ts'

const app = new Hono()

app.use(logger(), contextStorage())

// test urls:
// http://localhost:3000/?action=query&platform=arcade&inputs=%5B%7B%22launchboxId%22%3A140%2C%22libretroId%22%3A%2223a02b3f92193510329426621b8a23fd94ad886e%22%7D%5D
// http://localhost:3000/?action=sleuth&platform=arcade&inputs=mslug.zip
app.get(
  '/',
  zValidator(
    'query',
    z.object({
      action: z.enum(['sleuth', 'query']).optional(),
      inputs: z.string().default(''),
      platform: z.string().default(''),
    }),
  ),
  async (c) => {
    if (!import.meta.dirname) {
      return c.text('Home page for this environment is not supported yet. Use APIs directly.', 404)
    }

    const template = path.resolve(import.meta.dirname, '..', 'templates', 'home.pug')

    const { action, inputs, platform } = c.req.valid('query')

    const parsedInputs = inferInputs(inputs)
    function inferInputs(rawInputs: string) {
      const inputs = rawInputs.trim()
      if (!inputs) {
        return
      }
      if (!inputs.startsWith('[')) {
        if (inputs.startsWith('{')) {
          return inferInputs(`[${inputs}]`)
        }
        if (action === 'sleuth') {
          return inferInputs(inputs.includes('.') ? `{name:'${inputs}'}` : `{md5:'${inputs}'}`)
        }
        if (action === 'query') {
          return inferInputs(/\d+/.test(inputs) ? `{launchboxId:${inputs}}` : `{libretroId:'${inputs}'}`)
        }
      }
      return safeParseJson5(inputs)
    }

    const locals = { action, c, inputs, platform, platforms, results: [] as any[] }

    if (action && parsedInputs) {
      switch (action) {
        case 'query':
          locals.results = await query(parsedInputs)
          break
        case 'sleuth':
          locals.results = await sleuth(platform, parsedInputs)
          break
      }
    }

    const html = renderFile(template, locals)
    return c.html(html)
  },
)

app.get('/api/v1/query', async (c) => {
  const conditions = JSON.parse(c.req.query('conditions') || '')
  const results = await query(conditions)
  return c.json(results)
})

app.get('/api/v1/sleuth', async (c) => {
  const platform = c.req.query('platform') || ''
  const files = JSON.parse(c.req.query('files') || '')
  const results = await sleuth(platform, files)
  return c.json(results)
})

export { app }

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { z } from 'zod'
import { platformMap } from './constants/platform.ts'
import { getPlatformInfo } from './controllers/get-platform-info.ts'
import { identify } from './controllers/identify.ts'
import { query } from './controllers/query.ts'
import { render } from './template/template.gen.ts'
import { safeParseJson5 } from './utils.ts'

const app = new Hono()

app.use(logger(), contextStorage(), cors())

// test urls:
// http://localhost:3000/?action=query&platform=arcade&inputs=%5B%7B%22launchboxId%22%3A140%2C%22libretroId%22%3A%2223a02b3f92193510329426621b8a23fd94ad886e%22%7D%5D
// http://localhost:3000/?action=identify&platform=arcade&inputs=mslug.zip
app.get(
  '/',
  zValidator(
    'query',
    z.object({
      action: z.enum(['identify', 'query']).optional(),
      inputs: z.string().default(''),
      platform: z.string().default(''),
    }),
  ),
  async (c) => {
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
        if (action === 'identify') {
          return inferInputs(inputs.includes('.') ? `{name:'${inputs}'}` : `{md5:'${inputs}'}`)
        }
        if (action === 'query') {
          return inferInputs(/\d+/.test(inputs) ? `{launchboxId:${inputs}}` : `{libretroId:'${inputs}'}`)
        }
      }
      return safeParseJson5(inputs)
    }

    const locals = { action, c, inputs, platform, platformMap, results: [] as any[] }

    if (action && parsedInputs) {
      switch (action) {
        case 'identify':
          locals.results = await identify(platform, parsedInputs)
          break
        case 'query':
          locals.results = await query(parsedInputs)
          break
      }
    }

    const html = render(locals)
    return c.html(html)
  },
)

app.post(
  '/api/v1/metadata/identify',

  zValidator(
    'json',
    z.object({
      files: z.array(
        z.object({
          md5: z.string().optional(),
          name: z.string(),
        }),
      ),
      platform: z.string(),
    }),
  ),

  async (c) => {
    const { files, platform } = c.req.valid('json')
    const results = await identify(platform, files)
    return c.json(results)
  },
)

app.post(
  '/api/v1/metadata/query',

  zValidator(
    'json',
    z.object({
      conditions: z.array(
        z.object({
          launchboxId: z.number().or(z.null()).optional(),
          libretroId: z.string().or(z.null()).optional(),
        }),
      ),
    }),
  ),

  async (c) => {
    const { conditions } = c.req.valid('json')
    const results = await query(conditions)
    return c.json(results)
  },
)

app.get(
  '/api/v1/platform/:name',

  zValidator(
    'param',
    z.object({
      name: z.string(),
    }),
  ),

  async (c) => {
    const { name } = c.req.valid('param')
    const result = await getPlatformInfo(name)
    return c.json(result)
  },
)

export { app }

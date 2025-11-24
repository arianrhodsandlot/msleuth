import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apis } from './apis.ts'
import { favicon } from './favicon.ts'

const docPath = 'doc'

export const app = new OpenAPIHono()
  .doc(docPath, { info: { title: 'MSleuth', version: '1' }, openapi: '3.1.1' })
  .use(logger(), contextStorage(), cors())
  .get('', Scalar({ pageTitle: 'MSleuth', url: docPath }))
  .get('favicon.ico', (c) =>
    c.body(favicon, 200, { 'Cache-Control': 'public, max-age=31536000', 'Content-Type': 'image/x-icon' }),
  )
  .route('api/v1', apis)

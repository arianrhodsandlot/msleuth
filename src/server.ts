import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apis } from './apis.ts'

export const app = new OpenAPIHono()

app.use(logger(), contextStorage(), cors())

app
  .doc('doc', {
    info: {
      title: 'MSleuth API',
      version: '1',
    },
    openapi: '3.1.1',
  })
  .get('reference', Scalar({ url: 'doc' }))
  .route('api/v1', apis)

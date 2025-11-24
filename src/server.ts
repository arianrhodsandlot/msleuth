import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apis } from './apis.ts'

const docPath = 'doc'

export const app = new OpenAPIHono()
  .doc(docPath, { info: { title: 'MSleuth API', version: '1' }, openapi: '3.1.1' })
  .use(logger(), contextStorage(), cors())
  .get('', Scalar({ url: docPath }))
  .route('api/v1', apis)

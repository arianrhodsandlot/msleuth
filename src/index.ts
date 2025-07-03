import { serve } from '@hono/node-server'
import { getRuntimeKey } from 'hono/adapter'
import { app } from './server.ts'

const runtimeKey = getRuntimeKey()
if (runtimeKey === 'node') {
  serve(app, (info) => {
    console.info(`MSleuth node server is running at http://localhost:${info.port}`)
  })
}

export default app

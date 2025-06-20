import { serve } from '@hono/node-server'
import { app } from './app.ts'

serve(app, (info) => {
  console.info(`Server is running at http://localhost:${info.port}`)
})

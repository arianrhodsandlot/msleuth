import assert from 'node:assert'
import { template } from 'es-toolkit/compat'
import fs from 'fs-extra'

assert.ok('MSLEUTH_DB_DATABASE_ID' in process.env, 'Environment variable MSLEUTH_DB_DATABASE_ID must be set')

const wranglerConfigTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerConfigTemplate)
const wranglerConfig = compiled(process.env)
await fs.writeFile('wrangler.json', wranglerConfig)

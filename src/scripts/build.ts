import { $ } from 'execa'
import fs from 'fs-extra'

const $$ = $({ verbose: 'full' })

const targetRuntime = process.env.TARGET_RUNTIME || 'node'

await $$('node', ['--run=build:template'])

const original = await fs.readFile('src/database/index.ts', 'utf8')
await fs.writeFile('src/database/index.ts', `export * from './adaptors/${targetRuntime}.ts'`)
await $$('tsdown')
await fs.writeFile('src/database/index.ts', original)

if (targetRuntime === 'workerd') {
  await $$('node', ['--run=build:wrangler-config'])
}

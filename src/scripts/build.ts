import { $ } from 'execa'
import fs from 'fs-extra'

const $$ = $({ verbose: 'full' })

const targetRuntime = process.env.TARGET_RUNTIME || 'bun'

const original = await fs.readFile('src/database/index.ts', 'utf8')
await fs.writeFile('src/database/index.ts', `export * from './adaptors/${targetRuntime}.ts'`)
await $$(`bun build src/index.ts --outdir=dist --target=bun`)
await fs.writeFile('src/database/index.ts', original)

if (targetRuntime === 'workerd') {
  await $$('bun', ['build:wrangler-config'])
}

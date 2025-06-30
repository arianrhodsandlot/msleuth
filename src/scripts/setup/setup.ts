import path from 'node:path'
import { $, execaNode } from 'execa'
import fs from 'fs-extra'

const $$ = $({ verbose: 'full' })

async function prepareZip(inputSubDirectory: string, url: string) {
  const inputDirectory = path.join('src', 'scripts', 'setup', 'tmp', 'inputs', inputSubDirectory)
  await fs.mkdirp(inputDirectory)
  const { base, name } = path.parse(new URL(url).pathname)
  const zipDirectory = path.join(inputDirectory, name)
  const zipPath = path.join(inputDirectory, base)
  if (!(await fs.exists(zipDirectory))) {
    if (!(await fs.exists(zipPath))) {
      await $$`curl ${url} -o ${zipPath}`
    }
    await $$`unzip ${zipPath} -d ${zipDirectory}`
  }
}

await fs.remove(path.join('src', 'database', 'msleuth.db'))

// Prepare the input metadata files
await Promise.all([
  prepareZip('libretro', 'https://buildbot.libretro.com/assets/frontend/database-rdb.zip'),
  prepareZip('launchbox', 'https://gamesdb.launchbox-app.com/metadata.zip'),
])

// Initialize a temporary database
await fs.mkdirp(path.join('src', 'scripts', 'setup', 'tmp', 'artifacts'))
const drizzleConfigPath = path.join('src', 'database', 'drizzle.config.ts')
await $$`drizzle-kit --config=${drizzleConfigPath} generate --name=init`
await $$`drizzle-kit --config=${drizzleConfigPath} migrate`

// Prepare data for the temporary database
const execaNodeVerbose = execaNode({ verbose: 'full' })
await Promise.all([
  execaNodeVerbose`${path.join('src', 'scripts', 'setup', 'extract-libretro-db.ts')}`,
  execaNodeVerbose`${path.join('src', 'scripts', 'setup', 'extract-launchbox-metadata.ts')}`,
])

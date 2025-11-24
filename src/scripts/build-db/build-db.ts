import path from 'node:path'
import { Database } from 'bun:sqlite'
import { $ } from 'execa'
import fs from 'fs-extra'

const $$ = $({ verbose: 'full' })

const tmp = path.join(process.cwd(), 'tmp')

async function prepareZip(inputSubDirectory: string, url: string) {
  const inputDirectory = path.join(tmp, 'inputs', inputSubDirectory)
  const { base, name } = path.parse(new URL(url.toLowerCase()).pathname)
  const zipDirectory = path.join(inputDirectory, name)
  const zipPath = path.join(inputDirectory, base)

  const hasDownloadedZip = await fs.exists(zipPath)
  if (!hasDownloadedZip) {
    await fs.mkdirp(zipDirectory)
    await $$`curl ${url} -o ${zipPath}`
  }
  try {
    await fs.remove(zipDirectory)
    await $$`unzip ${zipPath} -d ${zipDirectory}`
  } catch (error) {
    console.error(error)
    await fs.remove(zipPath)
    await prepareZip(inputSubDirectory, url)
  }
}

// Prepare the input metadata files
await Promise.all([
  prepareZip('libretro', 'https://buildbot.libretro.com/assets/frontend/database-rdb.zip'),
  prepareZip('launchbox', 'https://gamesdb.launchbox-app.com/Metadata.zip'),
])
await fs.remove(path.join('msleuth.sqlite'))
await fs.mkdirp(path.join(tmp, 'artifacts'))
const drizzleConfigPath = path.join('src', 'database', 'drizzle.config.ts')
await $$`drizzle-kit --config=${drizzleConfigPath} generate --name=init`
const migration = path.join('src', 'database', 'migrations', '0000_init.sql')
const db = new Database('msleuth.sqlite')
const sql = await fs.readFile(migration, 'utf8')
db.run(sql)
db.close()

// Prepare data for the temporary database
await $$`bun ${path.join(import.meta.dirname, 'extract-libretro-db.ts')}`
await $$`bun ${path.join(import.meta.dirname, 'extract-launchbox-metadata.ts')}`

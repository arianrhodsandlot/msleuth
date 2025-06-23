import { $, fs, path } from 'zx'

async function prepareZip(inputSubDirectory: string, url: string) {
  const inputDirectory = path.join('src/scripts/setup/tmp/inputs', inputSubDirectory)
  await $`mkdir -p ${inputDirectory}`
  const { base, name } = path.parse(new URL(url).pathname)
  const zipDirectory = path.join(inputDirectory, name)
  const zipPath = path.join(inputDirectory, base)
  if (!(await fs.exists(zipDirectory))) {
    if (!(await fs.exists(zipPath))) {
      await $`curl ${url} -o ${zipPath}`
    }
    $`unzip ${zipPath} -d ${zipDirectory}`
  }
}

$.verbose = true

// await $`rm -rf src/scripts/setup/tmp`
await $`rm -rf src/database/msleuth.db`

// Prepare the input metadata files
await Promise.all([
  prepareZip('libretro', 'https://buildbot.libretro.com/assets/frontend/database-rdb.zip'),
  prepareZip('launchbox', 'https://gamesdb.launchbox-app.com/metadata.zip'),
])

// Initialize a temporary database
await $`mkdir -p src/scripts/setup/tmp/artifacts`
await $`drizzle-kit --config=src/database/drizzle.config.ts generate --name=init`
await $`drizzle-kit --config=src/database/drizzle.config.ts migrate`

// Prepare data for the temporary database
await Promise.all([
  $`node src/scripts/setup/extract-libretro-db.ts`,
  $`node src/scripts/setup/extract-launchbox-metadata.ts`,
])

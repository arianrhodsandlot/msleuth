import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'

const dbPath = path.join('src', 'database', 'msleuth.sqlite')
const dumpedPath = path.join('src', 'database', 'msleuth.sql')
const subprocess = execa('sqlite3', [dbPath, '.dump'], { buffer: false })
const writeStream = fs.createWriteStream(dumpedPath)
subprocess.stdout.pipe(writeStream)
const { promise, reject, resolve } = Promise.withResolvers<void>()
subprocess.catch(reject)
writeStream.on('error', reject)
writeStream.on('finish', resolve)
await promise

const content = await fs.readFile(dumpedPath, 'utf8')
const unsupportedCommands = ['BEGIN TRANSACTION', 'COMMIT']
await fs.writeFile(
  dumpedPath,
  content
    .split('\n')
    .filter((line) => unsupportedCommands.every((unsupportedCommand) => !line.includes(unsupportedCommand)))
    .join('\n'),
)

console.info(`Run "pnpm wrangler d1 execute msleuth-db --file=${dumpedPath}" to import the data to local D1.`)
console.info(`Run "pnpm wrangler d1 execute msleuth-db --remote --file=${dumpedPath}" to import the data to remote D1.`)

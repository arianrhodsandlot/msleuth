import { execFileSync } from 'node:child_process'
import path from 'node:path'
import fs from 'fs-extra'

const dbPath = path.join(process.cwd(), 'msleuth.sqlite')
const dumpedPath = path.join(process.cwd(), 'msleuth.sql')
const batchSize = 2000

function run<T>(sql: string) {
  return JSON.parse(execFileSync('sqlite3', ['-json', dbPath, sql], { maxBuffer: 1 << 26 }).toString() || '[]') as T
}

const objects = run<{ name: string; sql: string; type: string }>(
  "select type, name, sql from sqlite_master where sql is not null and name not like 'sqlite_%' order by rowid",
)
const tables = objects.filter(({ type }) => type === 'table')
const indexes = objects.filter(({ type }) => type === 'index')
const controlCharacters = /[\u0000-\u001f\u007f]/

function toLiteral(value: number | string | null, declaredType: string) {
  if (value === null) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    if (declaredType === 'integer' && !Number.isSafeInteger(value)) {
      throw new Error(`${value} in an integer column exceeds the safe range and was already rounded by JSON.parse`)
    }
    return String(value)
  }
  if (controlCharacters.test(value)) {
    return `CAST(X'${Buffer.from(value, 'utf8').toString('hex')}' AS TEXT)`
  }
  return `'${value.replaceAll("'", "''")}'`
}

const stream = fs.createWriteStream(dumpedPath)
const write = async (chunk: string) => {
  if (!stream.write(chunk)) {
    await new Promise((resolve) => stream.once('drain', resolve))
  }
}

await write('PRAGMA foreign_keys=OFF;\n')
for (const { sql } of tables) {
  await write(`${sql};\n`)
}
for (const { name } of tables) {
  const columns = run<{ name: string; type: string }>(`select name, type from pragma_table_info('${name}') order by cid`)
  const projected = columns.map(({ name }) => `"${name}"`).join(', ')
  let lastRowId = 0
  while (true) {
    const rows = run<(Record<string, number | string | null> & { __rid: number })[]>(
      `select rowid as __rid, ${projected} from "${name}" where rowid > ${lastRowId} order by rowid limit ${batchSize}`,
    )
    if (!rows.length) {
      break
    }
    const statements = rows.map((row) => `INSERT INTO "${name}" VALUES(${columns.map(({ name, type }) => toLiteral(row[name], type)).join(',')});`)
    await write(`${statements.join('\n')}\n`)
    lastRowId = rows.at(-1)!.__rid
  }
}
for (const { sql } of indexes) {
  await write(`${sql};\n`)
}
await new Promise((resolve) => stream.end(resolve))

console.info(`Run "bun wrangler d1 execute msleuth-db --file=msleuth.sql" to import the data to local D1.`)
console.info(`Run "bun wrangler d1 execute msleuth-db --remote --file=msleuth.sql" to import the data to remote D1.`)

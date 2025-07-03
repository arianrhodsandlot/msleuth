// import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3'
// import { drizzle as drizzleBunSqlite } from 'drizzle-orm/bun-sqlite'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { env, getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as schema from './schema.ts'

const dbFileName = 'msleuth.sqlite'
const runtime = getRuntimeKey()
const config = { casing: 'snake_case', schema } as const

export function getDB() {
  if (runtime === 'bun') {
    return drizzleBunSqlite(dbFileName, config)
  }
  if (runtime === 'node') {
    return drizzleBetterSqlite3(dbFileName, config)
  }
  if (runtime === 'workerd') {
    return drizzleD1(env(getContext(), 'workerd').MSLEUTH_DB, config)
  }
  throw new Error(`Unsupported runtime: ${runtime}. Supported runtimes are 'bun', 'node', and 'workerd'.`)
}

export type DB = ReturnType<typeof getDB>

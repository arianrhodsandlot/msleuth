import path from 'node:path'
import { env, getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as schema from './schema.ts'

async function getD1() {
  const { drizzle } = await import('drizzle-orm/d1')

  const c = getContext()
  const { MSLEUTH_DB } = env(c, 'workerd')
  const db = drizzle(MSLEUTH_DB, { casing: 'snake_case', schema })

  return db
}

async function getBetterSQLite3() {
  const { drizzle } = await import('drizzle-orm/better-sqlite3')

  const dbFileName = 'msleuth.sqlite'
  const dbFilePath = path.resolve(process.cwd(), dbFileName)
  const db = drizzle(dbFilePath, { casing: 'snake_case', schema })

  return db
}

async function getBunSQLite() {
  const { drizzle } = await import('drizzle-orm/bun-sqlite')

  const dbFileName = 'msleuth.sqlite'
  const dbFilePath = path.resolve(process.cwd(), dbFileName)
  const db = drizzle(dbFilePath, { casing: 'snake_case', schema })

  return db
}

export async function getDB() {
  const runtime = getRuntimeKey()
  const dbFunctions = { bun: getBunSQLite, node: getBetterSQLite3, workd: getD1 }
  if (!(runtime in dbFunctions)) {
    throw new Error(`Unsupported runtime: ${runtime}`)
  }
  const getDBFunction = dbFunctions[runtime as keyof typeof dbFunctions]
  const db = await getDBFunction()
  return db
}

export type DB = Awaited<ReturnType<typeof getDB>>

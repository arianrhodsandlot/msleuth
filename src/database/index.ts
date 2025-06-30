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

async function getSQLite() {
  const { drizzle } = await import('drizzle-orm/better-sqlite3')

  const dbFileName = 'msleuth.db'
  const dbFilePath = path.join(import.meta.dirname, dbFileName)
  const db = drizzle(dbFilePath, { casing: 'snake_case', schema })

  return db
}

const defaultDBType = getRuntimeKey() === 'workerd' ? 'd1' : 'sqlite'
export async function getDB(type = defaultDBType) {
  const getDBFunction = { d1: getD1, sqlite: getSQLite }[type]
  if (!getDBFunction) {
    throw new Error(`Unsupported database type: ${type}`)
  }
  const db = await getDBFunction()
  return db
}

export type DB = Awaited<ReturnType<typeof getDB>>

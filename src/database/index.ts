import path from 'node:path'
import * as schema from './schema.ts'

async function getSQLiteDB () {
  const { drizzle } = await import('drizzle-orm/better-sqlite3')

  const dbFileName = 'msleuth.db'
  const dbFilePath = path.join(import.meta.dirname, dbFileName)
  const db = drizzle(dbFilePath, { casing: 'snake_case', schema })

  return db
}

export async function getDB (type = 'sqlite') {
  const getDBFunction = { sqlite: getSQLiteDB }[type]
  if (!getDBFunction) {
    throw new Error(`Unsupported database type: ${type}`)
  }
  const db = await getDBFunction()
  return db
}

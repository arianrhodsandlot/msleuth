import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3'
import * as schema from '../schema.ts'

const dbFileName = 'msleuth.sqlite'
const config = { casing: 'snake_case', schema } as const

export function getDB() {
  return drizzleBetterSqlite3(dbFileName, config)
}

export type DB = ReturnType<typeof getDB>

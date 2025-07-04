import { drizzle as drizzleBunSqlite } from 'drizzle-orm/bun-sqlite'
import * as schema from '../schema.ts'

const dbFileName = 'msleuth.sqlite'
const config = { casing: 'snake_case', schema } as const

export function getDB() {
  return drizzleBunSqlite(dbFileName, config)
}

export type DB = ReturnType<typeof getDB>

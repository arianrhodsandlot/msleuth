import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import * as schema from '../schema.ts'

const config = { casing: 'snake_case', schema } as const

export function getDB() {
  return drizzleD1(env(getContext(), 'workerd').MSLEUTH_DB, config)
}

export type DB = ReturnType<typeof getDB>

import { sql } from 'drizzle-orm'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

export function getCompactName (name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}

export const executeQuery = async (db: BetterSQLite3Database, query) => {
  db.all(query)
  const debugResult = await db.run(sql`EXPLAIN QUERY PLAN ${query.getSQL()}`);
  console.log(debugResult)
  return await query;
};

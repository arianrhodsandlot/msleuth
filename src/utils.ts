import { sql } from 'drizzle-orm'
import json5 from 'json5'
import type { DB } from './database/index.ts'

export function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}

const isDebugging = process.env.MSLEUTH_DEBUG === 'true'
export async function executeQuery<T>(db: DB, query: T) {
  if (isDebugging) {
    // @ts-expect-error
    const plans = db.all(sql`EXPLAIN QUERY PLAN ${query.getSQL()}`)
    // @ts-expect-error
    console.info(query.toSQL(), ...plans.map((plan: any) => plan.detail))
  }
  return await query
}

export function restoreTitleForSorting(title: string) {
  // Match titles ending with ", A", ", An", or ", The" followed by optional additional info
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = title.match(/^(.*),\s*(A|An|The)(\s*(?:\S.*)?)$/)
  if (match) {
    // Reconstruct: article + space + main title + additional info
    return `${match[2]} ${match[1]}${match[3]}`
  }
  // Return original string if no match
  return title
}

export function safeParseJson5(input: string) {
  try {
    return json5.parse(input)
  } catch (error) {
    console.warn(error)
    return null
  }
}

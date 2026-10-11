import json5 from 'json5'
import type { DB } from './database/index.ts'

export function getCompactName(name: string) {
  return name.replaceAll(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '').toLowerCase()
}

export async function executeQuery<T>(db: DB, query: T) {
  return await query
}

export function restoreTitleForSorting(title: string) {
  // Match titles ending with ", A", ", An", or ", The" followed by optional additional info
  const match = title.match(/^(?<main>.*),\s*(?<article>A|An|The)(?<extra>\s*(?:\S.*)?)$/u)
  if (match) {
    // Reconstruct: article + space + main title + additional info
    return `${match.groups.article} ${match.groups.main}${match.groups.extra}`
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

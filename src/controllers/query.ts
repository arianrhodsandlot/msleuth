import { inArray } from 'drizzle-orm'
import { compact } from 'es-toolkit'
import { getDB } from '../database/index.ts'
import { launchboxGameTable, libretroGameTable } from '../database/schema.ts'
import { executeQuery } from '../utils.ts'

const emptyPromise = Promise.resolve([])
export async function query(
  conditions: { launchboxId?: null | number | undefined; libretroId?: null | string | undefined }[],
) {
  const db = getDB()

  const launchboxIds = compact(conditions.map(({ launchboxId }) => launchboxId))
  let launchboxPromise
  if (launchboxIds.length > 0) {
    const query = db.select().from(launchboxGameTable).where(inArray(launchboxGameTable.databaseId, launchboxIds))
    launchboxPromise = executeQuery(db, query)
  } else {
    launchboxPromise = emptyPromise
  }

  let libretroPromise
  const libretroIds = compact(conditions.map(({ libretroId }) => libretroId))
  if (libretroIds.length > 0) {
    const query = db.select().from(libretroGameTable).where(inArray(libretroGameTable.id, libretroIds))
    libretroPromise = executeQuery(db, query)
  } else {
    libretroPromise = emptyPromise
  }

  const [launchboxRows, libretroRows] = await Promise.all([launchboxPromise, libretroPromise])

  return conditions.map(({ launchboxId, libretroId }) => ({
    launchbox: launchboxRows.find((row) => row.databaseId === launchboxId),
    libretro: libretroRows.find((row) => row.id === libretroId),
  }))
}

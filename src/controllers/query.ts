import { inArray } from 'drizzle-orm'
import { getDB } from '../database/index.ts'
import { launchboxGameTable, libretroGameTable } from '../database/schema.ts'
import { executeQuery } from '../utils.ts'

export async function query(conditions: { launchboxId: number; libretroId: string }[]) {
  const db = getDB()

  const launchboxQuery = db
    .select()
    .from(launchboxGameTable)
    .where(
      inArray(
        launchboxGameTable.databaseId,
        conditions.map(({ launchboxId }) => launchboxId),
      ),
    )

  const libretroQuery = db
    .select()
    .from(libretroGameTable)
    .where(
      inArray(
        libretroGameTable.id,
        conditions.map(({ libretroId }) => libretroId),
      ),
    )
  const [libretroRows, launchboxRows] = await Promise.all([
    executeQuery(db, libretroQuery),
    executeQuery(db, launchboxQuery),
  ])

  return conditions.map(({ launchboxId, libretroId }) => ({
    launchbox: launchboxRows.find((row) => row.databaseId === launchboxId),
    libretro: libretroRows.find((row) => row.id === libretroId),
  }))
}

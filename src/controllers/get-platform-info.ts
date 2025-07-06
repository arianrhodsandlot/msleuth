import { eq } from 'drizzle-orm'
import { platformMap } from '../constants/platform.ts'
import { getDB } from '../database/index.ts'
import { launchboxPlatformTable } from '../database/schema.ts'
import { executeQuery } from '../utils.ts'

export async function getPlatformInfo(name: string) {
  const db = getDB()
  const launchboxName = platformMap[name]?.launchboxName
  if (launchboxName) {
    const query = db.select().from(launchboxPlatformTable).where(eq(launchboxPlatformTable.name, launchboxName))
    const [row] = await executeQuery(db, query)
    return row
  }
}

import path from 'node:path'
import { and, type Column, eq, inArray, or } from 'drizzle-orm'
import { parse } from 'goodcodes-parser'
import { platformMap } from '../constants/platform.ts'
import type { DB } from '../database/index.ts'
import { launchboxGameAlternateNameTable, launchboxGameTable } from '../database/schema.ts'
import type { ROMFile } from '../types/file.ts'
import { executeQuery, getCompactName, restoreTitleForSorting } from '../utils.ts'

export class LaunchboxProvider {
  private db: DB

  constructor({ db }: { db: DB }) {
    this.db = db
  }

  async guess(platform: string, files: ROMFile[]) {
    const platformLaunchboxName = platformMap[platform].launchboxName
    const extendedFiles = await this.getExtendedFiles(files)

    const columns = ['compactName', 'goodcodesBaseCompactName'] as const

    type Filter = { column: Column; values: (number | string)[] }
    const filters: Filter[] = columns.map((column) => ({
      column: launchboxGameTable[column],
      values: extendedFiles.map(({ [column]: value }) => value || '').filter(Boolean),
    }))
    filters.push({
      column: launchboxGameTable.databaseId,
      values: extendedFiles.flatMap(({ alternateDatabaseIds }) => alternateDatabaseIds),
    })
    const validFilters = filters.filter(({ values }) => values.length)

    const query = this.db
      .select()
      .from(launchboxGameTable)
      .where(
        and(
          or(...validFilters.map(({ column, values }) => inArray(column, values))),
          eq(launchboxGameTable.platform, platformLaunchboxName),
        ),
      )

    const rows = await executeQuery(this.db, query)

    return extendedFiles.map((extendedFile) => {
      for (const column of columns) {
        const result = rows.find(({ [column]: value }) => value === extendedFile[column])
        if (result) {
          return result
        }

        const alternateResult = rows.find(({ databaseId }) => extendedFile.alternateDatabaseIds.includes(databaseId))
        if (alternateResult) {
          return alternateResult
        }
      }
      return null
    })
  }

  private async getExtendedFiles(files: ROMFile[]) {
    if (files.length === 0) {
      return []
    }

    const extendedFiles = files.map((file) => {
      const alternateDatabaseIds: number[] = []
      const baseName = path.parse(file.name || '').name
      const restoredBaseName = restoreTitleForSorting(parse(`0 - ${baseName}`).rom)
      const compactName = file.compactName || getCompactName(restoredBaseName)
      const goodcodes = parse(`0 - ${restoredBaseName}`)
      const goodcodesBaseName = goodcodes.rom
      const goodcodesBaseCompactName = file.goodcodesBaseCompactName || getCompactName(goodcodesBaseName)
      return { ...file, alternateDatabaseIds, baseName, compactName, goodcodesBaseCompactName, restoredBaseName }
    })

    const query = this.db
      .select()
      .from(launchboxGameAlternateNameTable)
      .where(
        inArray(
          launchboxGameAlternateNameTable.compactName,
          extendedFiles.map(({ compactName }) => compactName),
        ),
      )

    const rows = await executeQuery(this.db, query)

    for (const row of rows) {
      for (const extendedFile of extendedFiles) {
        if (row.compactName === extendedFile.compactName && row.databaseId) {
          extendedFile.alternateDatabaseIds.push(row.databaseId)
        }
      }
    }

    return extendedFiles
  }
}

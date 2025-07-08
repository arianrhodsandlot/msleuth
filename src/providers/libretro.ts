import path from 'node:path'
import { and, inArray, or } from 'drizzle-orm'
import { parse } from 'goodcodes-parser'
import { platformMap } from '../constants/platform.ts'
import type { DB } from '../database/index.ts'
import { libretroGameTable } from '../database/schema.ts'
import type { ROMFile } from '../types/file.ts'
import { executeQuery, getCompactName } from '../utils.ts'

export class LibretroProvider {
  private db: DB

  constructor({ db }: { db: DB }) {
    this.db = db
  }

  async identify(platform: string, files: ROMFile[]) {
    const md5Results = await this.identifyByColumns(platform, files, ['md5'])
    if (md5Results.every(Boolean)) {
      return md5Results
    }

    const arcadeNameColumns = ['romName'] as const
    const generalNameColumns = ['romName', 'name', 'compactName', 'goodcodesBaseCompactName'] as const
    const nameColumns = platform === 'arcade' ? arcadeNameColumns : generalNameColumns
    const nameResults = await this.identifyByColumns(platform, files, nameColumns)

    return files.map((file, index) => md5Results[index] || nameResults[index])
  }

  private getExtendedFiles(files: ROMFile[]) {
    const extendedFiles = files.map((file) => {
      const { name } = path.parse(file.name || '')
      const compactName = getCompactName(name)
      const goodcodesBaseCompactName = getCompactName(parse(`0 - ${name}`).rom)
      return { ...file, compactName, goodcodesBaseCompactName, name, romName: file.name }
    })

    return extendedFiles
  }

  private async identifyByColumns(
    platform: string,
    files: ROMFile[],
    columns: readonly ('compactName' | 'goodcodesBaseCompactName' | 'md5' | 'name' | 'romName')[],
  ) {
    const extendedFiles = this.getExtendedFiles(files)

    const filters = columns.map((column) => ({
      column: libretroGameTable[column],
      values: extendedFiles.map(({ [column]: value }) => value || '').filter(Boolean),
    }))
    const validFilters = filters.filter(({ values }) => values.length)
    if (validFilters.length === 0) {
      return Array.from({ length: files.length }).fill(null)
    }

    const arcadeLibretroPlatforms = ['MAME', 'MAME 2003-Plus', 'FBNeo - Arcade Games']
    const libretroPlatforms = platform === 'arcade' ? arcadeLibretroPlatforms : [platformMap[platform].libretroName]
    const query = this.db
      .select()
      .from(libretroGameTable)
      .where(
        and(
          or(...validFilters.map(({ column, values }) => inArray(column, values))),
          inArray(libretroGameTable.platform, libretroPlatforms),
        ),
      )

    const rows = await executeQuery(this.db, query)

    return extendedFiles.map((extendedFile) => {
      for (const column of columns) {
        const result = rows.find(({ [column]: value }) => value === extendedFile[column])
        if (result) {
          return result
        }
      }
      return null
    })
  }
}

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

  getExtendedFiles(files: ROMFile[]) {
    const extendedFiles = files.map((file) => {
      const { name } = path.parse(file.name || '')
      const compactName = getCompactName(name)
      const goodcodesBaseCompactName = getCompactName(parse(`0 - ${name}`).rom)
      return { ...file, compactName, goodcodesBaseCompactName, name, romName: file.name }
    })

    return extendedFiles
  }

  async guess(platform: string, files: ROMFile[]) {
    const extendedFiles = this.getExtendedFiles(files)

    const columns =
      platform === 'arcade'
        ? (['md5', 'romName'] as const)
        : (['md5', 'romName', 'name', 'compactName', 'goodcodesBaseCompactName'] as const)

    const filters = columns
      .map((column) => ({
        column: libretroGameTable[column],
        values: extendedFiles.map(({ [column]: value }) => value || '').filter(Boolean),
      }))
      .filter(({ values }) => values.length)

    const arcadeLibretroPlatforms = ['MAME', 'MAME 2003-Plus', 'FBNeo - Arcade Games']
    const libretroPlatforms = platform === 'arcade' ? arcadeLibretroPlatforms : [platformMap[platform].libretroName]
    const query = this.db
      .select()
      .from(libretroGameTable)
      .where(
        and(
          inArray(libretroGameTable.platform, libretroPlatforms),
          or(...filters.map(({ column, values }) => inArray(column, values))),
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

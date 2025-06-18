import path from 'node:path'
import { and, eq, inArray, or } from 'drizzle-orm'
import { libretroGameTable } from '../database/schema.ts'
import { executeQuery, getCompactName } from '../utils.ts'
import { platformMap } from '../constants/platform.ts'
import { parse } from 'goodcodes-parser'

export class LibretroProvider {
  private db

  constructor({ db }) {
    this.db = db
  }

  async guessByMd5(files) {
    const [{ platform }] = files
    const results = await this.db
      .select()
      .from(libretroGameTable)
      .where(
        and(
          inArray(
            libretroGameTable.md5,
            files.map(({ md5 }) => md5)
          ),
          eq(libretroGameTable.platform, platformMap[platform].libretroName)
        )
      )
    return results
  }

  async guessByName(files) {
    const [{ platform }] = files

    const filters = [
      { column: libretroGameTable.romName, values: files.map(({ name }) => name) },
      { column: libretroGameTable.name, values: files.map(({ name }) => path.parse(name).name) },
      { column: libretroGameTable.compactName, values: files.map(({ name }) => getCompactName(path.parse(name).name)) },
      { column: libretroGameTable.goodcodesBaseCompactName, values: files.map(({ name }) => getCompactName(parse(`0 - ${path.parse(name).name}`).rom)) },
    ]

    const q = this.db
      .select()
      .from(libretroGameTable)
      .where(
        and(
          or(...filters.map(({ column, values }) => inArray(column, values))),
          eq(libretroGameTable.platform, platformMap[platform].libretroName)
        )
      )

    const results = await executeQuery(this.db, q)
    return results
  }

  async guess(files) {
    const results = this.guessByName(files)
    return results
  }

  getMultible() {
    this.db
  }
}

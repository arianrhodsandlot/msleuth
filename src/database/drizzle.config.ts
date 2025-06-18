import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: 'src/database/msleuth.db',
  },
  dialect: 'sqlite',
  out: 'src/databases/migrations',
  schema: 'src/databases/schema.ts',
})

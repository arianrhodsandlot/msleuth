import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: 'src/database/msleuth.db',
  },
  dialect: 'sqlite',
  out: 'src/database/migrations',
  schema: 'src/database/schema.ts',
})

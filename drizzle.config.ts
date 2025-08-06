import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "turso",
  schema: "src/services/schema.ts",
  strict: true,
  dbCredentials: {
    url: "file:sqlite.db",
  },
})

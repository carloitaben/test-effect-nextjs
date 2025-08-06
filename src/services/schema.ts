import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  role: text({
    enum: ["admin", "moderator", "user"],
  })
    .notNull()
    .default("user"),
})

export const post = sqliteTable("post", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
})

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { Role } from "./policy"

export const user = sqliteTable("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  role: text({ enum: Role.literals }).notNull().default(Role.literals[2]),
})

export const post = sqliteTable("post", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
})

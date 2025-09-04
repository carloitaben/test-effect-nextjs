import { Layer, ManagedRuntime } from "effect"
import { Database, Drizzle } from "../database"
import { Post } from "../post"
import { CookiesServer } from "../cookies/server"

export const MainServer = Layer.mergeAll(
  Layer.provide(Drizzle.Default, Database.Default),
  CookiesServer,
  Post.Default,
)

export const ServerRuntime = ManagedRuntime.make(MainServer)

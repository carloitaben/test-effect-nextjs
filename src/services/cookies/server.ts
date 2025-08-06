import "server-only"
import { Effect, Layer } from "effect"
import { cookies } from "next/headers"
import { Cookies } from "./tag"

export const CookiesServer = Layer.succeed(
  Cookies,
  Cookies.of({
    has: (name) =>
      Effect.promise(cookies).pipe(Effect.map((cookies) => cookies.has(name))),
    get: (name) =>
      Effect.promise(cookies).pipe(
        Effect.map((cookies) => cookies.get(name)?.name)
      ),
    set: (name, value, cookie) =>
      Effect.promise(cookies).pipe(
        Effect.tap((cookies) => cookies.set(name, value, cookie))
      ),
    delete: (name) =>
      Effect.promise(cookies).pipe(
        Effect.tap((cookies) => cookies.delete(name))
      ),
  })
)

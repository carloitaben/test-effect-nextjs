import { Effect, Layer } from "effect"
import { parse, serialize } from "cookie-es"
import { Cookies } from "./tag"

export const CookiesClient = Layer.succeed(
  Cookies,
  Cookies.of({
    has: (name) => Effect.sync(() => Boolean(parse(document.cookie)[name])),
    get: (name) => Effect.sync(() => parse(document.cookie)[name]),
    set: (name, value, cookie) =>
      Effect.sync(() => {
        document.cookie = serialize(name, value, {
          path: "/",
          ...cookie,
        })
      }),
    delete: (name) =>
      Effect.sync(() => {
        document.cookie = serialize(name, "", {
          path: "/",
          maxAge: 0,
        })
      }),
  }),
)

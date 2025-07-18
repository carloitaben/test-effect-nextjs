import { Context, Effect } from "effect"
import type { CookieSerializeOptions } from "cookie-es"

// These methods have to be effects since they are async on the server
export class Cookies extends Context.Tag("Cookies")<
  Cookies,
  {
    has: (name: string) => Effect.Effect<boolean, never, never>
    get: (name: string) => Effect.Effect<string | undefined, never, never>
    set: (
      name: string,
      value: string,
      cookie?: Partial<CookieSerializeOptions>
    ) => Effect.Effect<void, never, never>
    delete: (name: string) => Effect.Effect<void, never, never>
  }
>() {}

"use server"

import { Cookies } from "@/services/cookies/tag"
import { ServerRuntime } from "@/services/runtime/server"
import { Effect } from "effect"

export async function serverAction() {
  const result = await ServerRuntime.runPromise(
    Effect.gen(function* () {
      const cookies = yield* Cookies
      yield* cookies.set("cookie", "server")
      return yield* cookies.has("cookie")
    })
  )

  console.log(result)
}

import { Effect } from "effect"
import { Suspense } from "react"
import { Cookies } from "@/services/cookies/tag"
import { ServerRuntime } from "@/services/runtime/server"
import { serverAction } from "@/actions/cookies"

export default async function CookieServer() {
  const result = ServerRuntime.runPromise(
    Effect.gen(function* () {
      const cookies = yield* Cookies
      yield* Effect.sleep(2000)
      return yield* cookies.has("cookie")
    })
  )

  return (
    <>
      <Suspense fallback={"..."}>
        {result.then((result) =>
          result ? "has cookie" : "doesnt have cookie"
        )}
      </Suspense>
      <form action={serverAction}>
        <button>server</button>
      </form>
    </>
  )
}

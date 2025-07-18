import { Effect } from "effect"
import { Suspense } from "react"
import { Cookies } from "@/services/cookies/tag"
import { ServerRuntime } from "@/services/runtime/server"
import { serverAction } from "@/actions/cookies"

const program = Effect.gen(function* () {
  const cookies = yield* Cookies
  yield* Effect.sleep(2000)
  return yield* cookies.has("cookie")
})

export default async function CookieServer() {
  const result = ServerRuntime.runPromise(program)
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

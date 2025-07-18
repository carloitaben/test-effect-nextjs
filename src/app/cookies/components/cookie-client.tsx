"use client"

import { Effect } from "effect"
import { useActionState, useEffect } from "react"
import { Cookies } from "@/services/cookies/tag"
import { ClientRuntime } from "@/services/runtime/client"

const program = Effect.gen(function* () {
  const cookies = yield* Cookies
  yield* cookies.set("cookie", "client")
  return yield* cookies.has("cookie")
})

export default function Client() {
  const [result, action] = useActionState(
    () => ClientRuntime.runPromise(program),
    undefined
  )

  // that's what i'm doing!!
  useEffect(() => {
    console.log(result)
  }, [result])

  return (
    <form action={action}>
      <button>client</button>
    </form>
  )
}

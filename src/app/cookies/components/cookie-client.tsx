"use client"

import { Effect } from "effect"
import { useEffect } from "react"
import { Cookies } from "@/services/cookies/tag"
import { useActionEffect } from "@/lib/actions"

export default function Client() {
  const [state, action] = useActionEffect(() =>
    Effect.gen(function* () {
      const cookies = yield* Cookies
      yield* cookies.set("cookie", "client")
      return yield* cookies.has("cookie")
    })
  )

  // that's what i'm doing!!
  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <form action={action}>
      <button>client</button>
    </form>
  )
}

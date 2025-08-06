import { Post } from "@/services/post"
import { MainServer } from "@/services/runtime/server"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const post = yield* Post

  yield* Effect.all(
    [
      post.create(Math.random().toString()),
      post.create(Math.random().toString()),
      post.create(Math.random().toString()),
    ],
    { concurrency: "unbounded" }
  )

  return yield* post.all()
})

export default async function Page() {
  const result = await Effect.runPromiseExit(
    Effect.provide(program, MainServer)
  )

  return (
    <div>
      <pre>{JSON.stringify(result.toJSON(), null, 2)}</pre>
    </div>
  )
}

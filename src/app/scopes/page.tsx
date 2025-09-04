import { NodeSdkLive } from "@/services/otel"
import { Post } from "@/services/post"
import { MainServer } from "@/services/runtime/server"
import { Effect, Logger, LogLevel } from "effect"
import { Suspense } from "react"

const program = Effect.gen(function* () {
  yield* Effect.sleep(1000)
  const post = yield* Post

  yield* Effect.all(
    [
      post.create(Math.random().toString()),
      post.create(Math.random().toString()),
      post.create(Math.random().toString()),
    ],
    { concurrency: "unbounded" },
  )

  return yield* post.all()
})

export default async function Page() {
  const result = Effect.runPromiseExit(
    program.pipe(
      Effect.withSpan("Scopes page"),
      Logger.withMinimumLogLevel(LogLevel.Debug),
      Effect.provide(MainServer),
      Effect.provide(NodeSdkLive),
    ),
  )

  return (
    <div>
      <Suspense fallback="🌀">
        {result.then((result) => (
          <pre>{JSON.stringify(result.toJSON(), null, 2)}</pre>
        ))}
      </Suspense>
    </div>
  )
}

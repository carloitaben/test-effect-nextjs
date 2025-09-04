import { NodeSdkLive } from "@/services/otel"
import { Post } from "@/services/post"
import { MainServer } from "@/services/runtime/server"
import { Effect, Logger, LogLevel } from "effect"

const program = Effect.gen(function* () {
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
  const result = await Effect.runPromiseExit(
    program.pipe(
      Effect.withSpan("Scopes page"),
      Logger.withMinimumLogLevel(LogLevel.Debug),
      Effect.provide(MainServer),
      Effect.provide(NodeSdkLive),
    ),
  )

  return (
    <div>
      <pre>{JSON.stringify(result.toJSON(), null, 2)}</pre>
    </div>
  )
}

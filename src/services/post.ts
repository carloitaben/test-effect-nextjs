import { Effect } from "effect"
import { Drizzle } from "./database"
import { post } from "./schema"

export class Post extends Effect.Service<Post>()("Post", {
  succeed: {
    all: Effect.fn("Post all")(() =>
      Effect.flatMap(Drizzle, (drizzle) =>
        drizzle.run((client) => client.select().from(post)),
      ),
    ),
    create: Effect.fn("Post create")((title: string) =>
      Effect.gen(function* () {
        yield* Effect.annotateCurrentSpan("title", title)
        const drizzle = yield* Drizzle
        return yield* drizzle.run((client) =>
          client.insert(post).values({ title }).returning(),
        )
      }),
    ),
  },
}) {}

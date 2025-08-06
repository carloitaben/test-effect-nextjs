import "server-only";
import { Config, Context, Data, Effect, Layer, Match } from "effect";
import { Client, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export class DatabaseClientError extends Data.TaggedError(
  "DatabaseClientError",
)<ErrorOptions> {}

export class Database extends Context.Tag("Database")<Database, Client>() {
  static readonly Test = Layer.scoped(
    Database,
    Effect.acquireRelease(
      Effect.try({
        try: () =>
          createClient({
            url: "file:sqlite.db",
            fetch: globalThis.fetch,
          }),
        catch: (cause) => new DatabaseClientError({ cause }),
      }),
      (client) => Effect.sync(() => client.close()),
    ),
  );

  static readonly Live = Layer.scoped(
    Database,
    Effect.acquireRelease(
      Effect.try({
        try: () =>
          createClient({
            url: "file:sqlite.db", // <- SST resource
            fetch: globalThis.fetch,
          }),
        catch: (cause) => new DatabaseClientError({ cause }),
      }),
      (client) => Effect.sync(() => client.close()),
    ),
  );

  static readonly Default = Layer.unwrapEffect(
    Config.literal(
      "development",
      "production",
    )("NODE_ENV").pipe(
      Effect.andThen((value) =>
        Match.value(value).pipe(
          Match.when("development", () => this.Test),
          Match.when("production", () => this.Live),
          Match.exhaustive,
        ),
      ),
    ),
  );
}

export class DrizzleQueryError extends Data.TaggedError(
  "DrizzleQueryError",
)<ErrorOptions> {}

export class Drizzle extends Effect.Service<Drizzle>()("Drizzle", {
  effect: Effect.gen(function* () {
    const database = yield* Database;
    const orm = drizzle(database, { schema });
    return {
      run<Result>(callback: (client: typeof orm) => Promise<Result>) {
        return Effect.tryPromise({
          try: () => callback(orm),
          catch: (error) => new DrizzleQueryError({ cause: error }),
        });
      },
    };
  }),
}) {}

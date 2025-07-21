import { ClientRuntime } from "@/services/runtime/client"
import { Effect, type ManagedRuntime } from "effect"
import { useActionState } from "react"

export type ActionEffectResult<A, E> =
  | { error: E; data: null }
  | { error: null; data: A }
  | { error: null; data: null }

export const useActionEffect = <Payload, A, E>(
  effect: (
    payload: Payload
  ) => Effect.Effect<
    A,
    E,
    ManagedRuntime.ManagedRuntime.Context<typeof ClientRuntime>
  >
) => {
  return useActionState<ActionEffectResult<A, E>, Payload>(
    (_, payload) =>
      ClientRuntime.runPromise(
        effect(payload).pipe(
          Effect.match({
            onFailure: (error) => ({ error, data: null }),
            onSuccess: (data) => ({ error: null, data }),
          })
        )
      ),
    { error: null, data: null }
  )
}

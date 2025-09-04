import { Data, ParseResult } from "effect"
import { type NonEmptyReadonlyArray } from "effect/Array"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import { User } from "./user"

type PermissionAction = "read" | "upsert" | "delete"
type PermissionConfig = Record<string, ReadonlyArray<PermissionAction>>

// TODO: parse user. Transform input role to output array of permissions!!!!!!!!

export type InferPermissions<T extends PermissionConfig> = {
  [K in keyof T]: T[K][number] extends PermissionAction
    ? `${K & string}:${T[K][number]}`
    : never
}[keyof T]

export const makePermissions = <T extends PermissionConfig>(
  config: T,
): Array<InferPermissions<T>> => {
  return Object.entries(config).flatMap(([domain, actions]) =>
    actions.map((action) => `${domain}:${action}` as InferPermissions<T>),
  )
}

const Permissions = makePermissions({
  collection: ["read", "upsert", "delete"],
})

export const Permission = Schema.Literal(...Permissions).annotations({
  identifier: "Permission",
})

export type Permission = typeof Permission.Type

export const Role = Schema.Literal("admin", "moderator", "user").annotations({
  identifier: "Role",
})

export type Role = typeof Role.Type

export const PermissionsFromRole = Schema.transformOrFail(
  Role,
  Schema.Array(Permission),
  {
    strict: true,
    decode: (role) => {
      switch (role) {
        case "admin":
          return ParseResult.succeed([
            "collection:upsert",
            "collection:delete",
            "collection:read",
          ] as const satisfies Permission[])
        case "moderator":
          return ParseResult.succeed([
            "collection:delete",
            "collection:read",
          ] as const satisfies Permission[])
        case "user":
          return ParseResult.succeed([
            "collection:read",
          ] as const satisfies Permission[])
      }
    },
    encode: (permissions, _, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          permissions,
          "Encoding permissions back to a role is unsupported.",
        ),
      ),
  },
)

// export class UserAuthMiddleware extends HttpApiMiddleware.Tag<UserAuthMiddleware>()(
//   "UserAuthMiddleware",
//   {
//     failure: CustomHttpApiError.Unauthorized,
//     provides: CurrentUser,
//   }
// ) {}

export class Forbidden extends Data.TaggedError("Forbidden")<{
  message?: string
}> {}

/**
 * Represents an access policy that can be evaluated against the current user.
 * A policy is a function that returns Effect.void if access is granted,
 * or fails with a CustomHttpApiError.Forbidden if access is denied.
 */
type Policy<E = never, R = never> = Effect.Effect<void, Forbidden | E, User | R>

/**
 * Creates a policy from a predicate function that evaluates the current user.
 */
export const policy = <E, R>(
  predicate: (user: User["Type"]) => Effect.Effect<boolean, E, R>,
  message?: string,
): Policy<E, R> =>
  Effect.flatMap(User, (user) =>
    Effect.flatMap(predicate(user), (result) =>
      result ? Effect.void : Effect.fail(new Forbidden({ message })),
    ),
  )

/**
 * Applies a predicate as a pre-check to an effect.
 * If the predicate returns false, the effect will fail with Forbidden.
 */
export const withPolicy =
  <E, R>(policy: Policy<E, R>) =>
  <A, E2, R2>(self: Effect.Effect<A, E2, R2>) =>
    Effect.zipRight(policy, self)

/**
 * Composes multiple policies with AND semantics - all policies must pass.
 * Returns a new policy that succeeds only if all the given policies succeed.
 */
export const all = <E, R>(
  ...policies: NonEmptyReadonlyArray<Policy<E, R>>
): Policy<E, R> =>
  Effect.all(policies, {
    concurrency: 1,
    discard: true,
  })

/**
 * Composes multiple policies with OR semantics - at least one policy must pass.
 * Returns a new policy that succeeds if any of the given policies succeed.
 */
export const any = <E, R>(
  ...policies: NonEmptyReadonlyArray<Policy<E, R>>
): Policy<E, R> => Effect.firstSuccessOf(policies)

/**
 * Creates a policy that checks if the current user has a specific permission.
 */
export const permission = (requiredPermission: Permission): Policy =>
  policy((user) => Effect.succeed(user.permissions.has(requiredPermission)))

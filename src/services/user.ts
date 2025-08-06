import { Context } from "effect"
import { Permission } from "./policy"

export class User extends Context.Tag("User")<
  User,
  {
    readonly sessionId: string
    readonly userId: string
    readonly permissions: Set<Permission>
  }
>() {}

import "server-only"
import { Layer, ManagedRuntime } from "effect"
import { CookiesServer } from "../cookies/server"

export const ServerRuntime = ManagedRuntime.make(Layer.mergeAll(CookiesServer))

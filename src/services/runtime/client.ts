import { Layer, ManagedRuntime } from "effect"
import { CookiesClient } from "../cookies/client"

export const ClientRuntime = ManagedRuntime.make(Layer.mergeAll(CookiesClient))

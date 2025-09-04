import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"

import { name, version } from "../../package.json"

export const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: name, version },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter()),
}))

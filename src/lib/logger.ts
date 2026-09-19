type LogLevel = "debug" | "warn" | "error";

const SENSITIVE = /email|password|token|card|cvv|pan|secret|authorization/i;

function sanitize(value: unknown): unknown {
  if (typeof value === "string") {
    return SENSITIVE.test(value) ? "[redacted]" : value;
  }
  if (value && typeof value === "object") {
    return "[object]";
  }
  return value;
}

function write(level: LogLevel, scope: string, detail?: unknown) {
  if (process.env.NODE_ENV === "production" && level === "debug") return;
  const payload = detail === undefined ? scope : `${scope}: ${String(sanitize(detail))}`;
  if (level === "error") {
    console.error(`[box-and-go] ${payload}`);
    return;
  }
  if (level === "warn") {
    console.warn(`[box-and-go] ${payload}`);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    console.info(`[box-and-go] ${payload}`);
  }
}

export const logger = {
  debug: (scope: string, detail?: unknown) => write("debug", scope, detail),
  warn: (scope: string, detail?: unknown) => write("warn", scope, detail),
  error: (scope: string, detail?: unknown) => write("error", scope, detail),
};

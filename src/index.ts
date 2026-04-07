type LoggerConfig = {
  logPrefix?: boolean;
  logColor?: boolean;
  logAsJson?: boolean;
  prettyPrint?: boolean;
  correlationId?: string;
  levels?: Partial<Record<LogType, boolean>>;
  sanitizeInput?: boolean;
};

import { getSettingValue } from "./utils/settingsUtils.js";

type LogType = "warning" | "error" | "success";

const colorKeyMap: Record<
  LogType,
  "warningLogColor" | "errorLogColor" | "successLogColor"
> = {
  warning: "warningLogColor",
  error: "errorLogColor",
  success: "successLogColor",
};

const prefixKeyMap: Record<
  LogType,
  "warningLogPrefix" | "errorLogPrefix" | "successLogPrefix"
> = {
  warning: "warningLogPrefix",
  error: "errorLogPrefix",
  success: "successLogPrefix",
};

function formatValue(value: any, pretty?: boolean): string {
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === "object" && value !== null) {
    try {
      return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
    } catch {
      return "[Unserializable Object]";
    }
  }
  return String(value);
}

function sanitize(str: string): string {
  return str.replace(/[^\w\s\[\]-]/g, ""); // remove unsafe chars including ANSI
}

export function createLogger(...configs: LoggerConfig[]) {
  const config: LoggerConfig = Object.assign(
    {
      levels: { warning: true, error: true, success: true },
      sanitizeInput: true,
    },
    ...configs,
  );

  function isEnabled(type: LogType) {
    return config.levels?.[type] !== false;
  }

  function buildPayload(message: any, type: LogType, correlationId?: string) {
    return {
      type,
      message:
        message instanceof Error
          ? message.message
          : typeof message === "object"
            ? message
            : String(message),
      timestamp: Date.now(),
      correlationId: correlationId || config.correlationId,
      stack: message instanceof Error ? message.stack : undefined,
    };
  }

  function format(message: any, type: LogType, correlationId?: string) {
    let output: string;

    if (config.logAsJson) {
      const payload = buildPayload(message, type, correlationId);
      output = config.prettyPrint
        ? JSON.stringify(payload, null, 2)
        : JSON.stringify(payload);
    } else {
      output = formatValue(message, config.prettyPrint);

      if (config.logPrefix !== false) {
        const prefix = getSettingValue(prefixKeyMap[type]) ?? "";
        output = prefix + output;
      }

      if (config.correlationId || correlationId) {
        const id = (correlationId || config.correlationId || "").replace(
          /[^\w-]/g,
          "",
        );
        output = `[${id}] ` + output;
      }

      if (config.sanitizeInput !== false) {
        output = sanitize(output);
      }

      if (config.logColor !== false) {
        const color = getSettingValue(colorKeyMap[type]);
        if (typeof color !== "function") throw new Error("Invalid color");
        output = color(output);
      }
    }

    return output;
  }

  function logWarning(message: any, correlationId?: string) {
    if (!isEnabled("warning")) return;
    console.log(format(message, "warning", correlationId));
  }

  function logError(message: any, correlationId?: string) {
    if (!isEnabled("error")) return;
    console.log(format(message, "error", correlationId));
  }

  function logSuccess(message: any, correlationId?: string) {
    if (!isEnabled("success")) return;
    console.log(format(message, "success", correlationId));
  }

  return { logWarning, logError, logSuccess };
}

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createLogger: () => createLogger
});
module.exports = __toCommonJS(index_exports);

// src/utils/colorUtils.ts
var reset = "\x1B[0m";
function wrap(code, message) {
  return code + message + reset;
}
var colorUtils = {
  red: (msg) => wrap("\x1B[31m", msg),
  green: (msg) => wrap("\x1B[32m", msg),
  yellow: (msg) => wrap("\x1B[33m", msg),
  blue: (msg) => wrap("\x1B[34m", msg),
  magenta: (msg) => wrap("\x1B[35m", msg),
  cyan: (msg) => wrap("\x1B[36m", msg),
  white: (msg) => wrap("\x1B[37m", msg),
  bold: (msg) => wrap("\x1B[1m", msg),
  dim: (msg) => wrap("\x1B[2m", msg),
  italic: (msg) => wrap("\x1B[3m", msg),
  underline: (msg) => wrap("\x1B[4m", msg),
  bgRed: (msg) => wrap("\x1B[41m", msg),
  bgGreen: (msg) => wrap("\x1B[42m", msg),
  bgYellow: (msg) => wrap("\x1B[43m", msg)
};

// src/utils/settingsUtils.ts
var SETTINGS = [
  {
    name: "debug",
    defaultValue: false,
    description: "Will log extra info while using this library"
  },
  {
    name: "warningLogColor",
    defaultValue: colorUtils.yellow,
    description: "The color of the logged message"
  },
  {
    name: "errorLogColor",
    defaultValue: colorUtils.red,
    description: "The color of the logged message"
  },
  {
    name: "successLogColor",
    defaultValue: colorUtils.green,
    description: "The color of the logged message"
  },
  {
    name: "warningLogPrefix",
    defaultValue: "WARNING: ",
    description: "The prefix of the logged message"
  },
  {
    name: "errorLogPrefix",
    defaultValue: "ERROR: ",
    description: "The prefix of the logged message"
  },
  {
    name: "successLogPrefix",
    defaultValue: "SUCCESS: ",
    description: "The prefix of the logged message"
  }
];
var runtimeSettings = SETTINGS.map((s) => ({ ...s }));
function getSetting(setting) {
  const s = runtimeSettings.find((s2) => s2.name === setting);
  if (s && s.value === void 0) s.value = s.defaultValue;
  return s;
}
function getSettingValue(setting) {
  const s = getSetting(setting);
  return s ? s.value : void 0;
}

// src/index.ts
var colorKeyMap = {
  warning: "warningLogColor",
  error: "errorLogColor",
  success: "successLogColor"
};
var prefixKeyMap = {
  warning: "warningLogPrefix",
  error: "errorLogPrefix",
  success: "successLogPrefix"
};
function formatValue(value, pretty) {
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
function sanitize(str) {
  return str.replace(/[^\w\s\[\]-]/g, "");
}
function createLogger(...configs) {
  const config = Object.assign(
    {
      levels: { warning: true, error: true, success: true },
      sanitizeInput: true
    },
    ...configs
  );
  function isEnabled(type) {
    return config.levels?.[type] !== false;
  }
  function buildPayload(message, type, correlationId) {
    return {
      type,
      message: message instanceof Error ? message.message : typeof message === "object" ? message : String(message),
      timestamp: Date.now(),
      correlationId: correlationId || config.correlationId,
      stack: message instanceof Error ? message.stack : void 0
    };
  }
  function format(message, type, correlationId) {
    let output;
    if (config.logAsJson) {
      const payload = buildPayload(message, type, correlationId);
      output = config.prettyPrint ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
    } else {
      output = formatValue(message, config.prettyPrint);
      if (config.logPrefix !== false) {
        const prefix = getSettingValue(prefixKeyMap[type]) ?? "";
        output = prefix + output;
      }
      if (config.correlationId || correlationId) {
        const id = (correlationId || config.correlationId || "").replace(
          /[^\w-]/g,
          ""
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
  function logWarning(message, correlationId) {
    if (!isEnabled("warning")) return;
    console.log(format(message, "warning", correlationId));
  }
  function logError(message, correlationId) {
    if (!isEnabled("error")) return;
    console.log(format(message, "error", correlationId));
  }
  function logSuccess(message, correlationId) {
    if (!isEnabled("success")) return;
    console.log(format(message, "success", correlationId));
  }
  return { logWarning, logError, logSuccess };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLogger
});

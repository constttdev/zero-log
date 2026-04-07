# Zero Log

[![GNU License](https://img.shields.io/badge/license-GNU%20GPLv3-green?style=plastic)](https://choosealicense.com/licenses/gpl-3.0/)

A zero-dependency, fully configurable logger for Node.js and the browser.  
Supports structured logging, correlation IDs, level control, pretty printing, error stack formatting, custom colors, and more.

---

## Try it Online

Test **zero-log** directly in your browser using StackBlitz:

[Open in StackBlitz](https://stackblitz.com/edit/node-u7xssdzz?file=index.js)

---

## Installation

Install via npm:

```bash
npm install zero-log
```

---

## Features

- Zero dependency core
- Enable/disable log levels individually (`warning`, `error`, `success`)
- Correlation ID / request tracing per log or global
- JSON structured logging
- Pretty print objects and arrays
- Automatic error stack formatting
- Custom color system (built-in ANSI, no chalk)
- Prefix support for logs
- Level-based log enabling/disabling via config
- Safe handling for untrusted input
- Support for nested objects with indentation
- Optional function to sanitize log input
- ANSI escape stripping for security
- Timestamp included by default
- Optional global log context (e.g., user, request info)
- Optional function overrides for custom log formatting

---

## Usage

### Create a logger

```javascript
import { createLogger } from "zero-log";

const logger = createLogger({
  logPrefix: true,
  logColor: true,
  logAsJson: false,
  prettyPrint: true,
  correlationId: "req-123",
  levels: { warning: true, error: true, success: true },
  sanitizeInput: true, // default
});
```

---

### Basic logging

```javascript
logger.logWarning("This is a warning");
logger.logError("Something failed");
logger.logSuccess("Operation completed");
```

---

### Disable specific log levels

```javascript
const logger = createLogger({
  levels: {
    success: false,
  },
});

logger.logSuccess("This will NOT appear");
logger.logError("This will appear");
```

---

### JSON logging (for structured logs)

```javascript
const logger = createLogger({
  logAsJson: true,
  prettyPrint: true,
});

logger.logError("Database connection failed");
logger.logWarning({ user: "constt", action: "login" });
```

Output:

```json
{
  "type": "error",
  "message": "Database connection failed",
  "timestamp": 1712470000000,
  "correlationId": "req-123"
}
```

---

### Logging objects

```javascript
logger.logWarning({
  user: "constt",
  action: "login",
  ip: "127.0.0.1",
});
```

---

### Logging errors (with stack)

```javascript
logger.logError(new Error("Something broke"));
```

Automatically includes stack trace.

---

### Per-request correlation ID

```javascript
logger.logWarning("User login", "req-999");
logger.logError("Database failed", "req-999");
```

---

### Pretty printing nested objects

```javascript
logger.logWarning({
  user: "constt",
  actions: ["login", "update_profile", "logout"],
  meta: { ip: "127.0.0.1", browser: "firefox" },
});
```

---

## Configuration Options

| Option        | Type                       | Default   | Description                                                          |
| ------------- | -------------------------- | --------- | -------------------------------------------------------------------- |
| logPrefix     | boolean                    | true      | Add prefix for logs                                                  |
| logColor      | boolean                    | true      | Enable colored output                                                |
| logAsJson     | boolean                    | false     | Output logs as JSON                                                  |
| prettyPrint   | boolean                    | false     | Pretty-print objects/JSON                                            |
| correlationId | string                     | undefined | Global correlation/request ID                                        |
| levels        | object (LogType → boolean) | all true  | Enable/disable individual log levels (`warning`, `error`, `success`) |
| sanitizeInput | boolean                    | true      | Remove ANSI sequences and unsafe characters from input               |

---

## Security Notes

### Log Injection

User-controlled input may manipulate logs:

```javascript
logger.logWarning("\n[ERROR] fake log");
```

Mitigation:

- Use JSON mode in production
- Sanitize user input

---

### ANSI Escape Injection

Attackers can inject terminal codes:

```javascript
"\x1b[31mHACKED";
```

Mitigation:

- Strip ANSI sequences for untrusted input

---

### Sensitive Data Exposure

Avoid logging:

- Passwords
- Tokens
- Personal identifiable information

---

## Authors

- [@constttdev](https://github.com/constttdev)

---

## Support

- GitHub Issues on the repo
- Discord: [Join Server](https://constt.de/r/discord)

---

## Feedback

Post feedback or suggestions on [Discord](https://constt.de/r/discord).

---

## License

This project is licensed under the [GNU GPLv3 License](https://choosealicense.com/licenses/gpl-3.0/).

---

## Takeaways

- Core is zero dependency → secure, lightweight, and fast
- Supports structured JSON logging and correlation IDs
- Configurable per log level, prefix, color, and output format
- Designed for both dev (pretty, color) and production (JSON, structured) environments
- Safe defaults with optional overrides for custom formatting
- sanitizeInput is on by default to prevent malicious input

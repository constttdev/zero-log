import { createLogger } from "../index.js";

function main() {
  const logger = createLogger({ sanitizeInput: false });

  logger.logError("Error message");
  logger.logWarning("Warning message");
  logger.logSuccess("Success message");
}

main();

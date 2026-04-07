type LoggerConfig = {
    logPrefix?: boolean;
    logColor?: boolean;
    logAsJson?: boolean;
    prettyPrint?: boolean;
    correlationId?: string;
    levels?: Partial<Record<LogType, boolean>>;
    sanitizeInput?: boolean;
};
type LogType = "warning" | "error" | "success";
declare function createLogger(...configs: LoggerConfig[]): {
    logWarning: (message: any, correlationId?: string) => void;
    logError: (message: any, correlationId?: string) => void;
    logSuccess: (message: any, correlationId?: string) => void;
};

export { createLogger };

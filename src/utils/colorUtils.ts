const reset = "\x1b[0m";

function wrap(code: string, message: string) {
  return code + message + reset;
}

export const colorUtils = {
  red: (msg: string) => wrap("\x1b[31m", msg),
  green: (msg: string) => wrap("\x1b[32m", msg),
  yellow: (msg: string) => wrap("\x1b[33m", msg),
  blue: (msg: string) => wrap("\x1b[34m", msg),
  magenta: (msg: string) => wrap("\x1b[35m", msg),
  cyan: (msg: string) => wrap("\x1b[36m", msg),
  white: (msg: string) => wrap("\x1b[37m", msg),

  bold: (msg: string) => wrap("\x1b[1m", msg),
  dim: (msg: string) => wrap("\x1b[2m", msg),
  italic: (msg: string) => wrap("\x1b[3m", msg),
  underline: (msg: string) => wrap("\x1b[4m", msg),

  bgRed: (msg: string) => wrap("\x1b[41m", msg),
  bgGreen: (msg: string) => wrap("\x1b[42m", msg),
  bgYellow: (msg: string) => wrap("\x1b[43m", msg),
};

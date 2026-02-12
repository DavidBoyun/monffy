import pino from "pino";
import { config } from "../config.js";

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
      messageFormat: "{msg}",
    },
  },
});

export const agentLog = logger.child({ component: "agent" });
export const priceLog = logger.child({ component: "price" });
export const brainLog = logger.child({ component: "brain" });
export const chainLog = logger.child({ component: "chain" });
export const dbLog = logger.child({ component: "db" });

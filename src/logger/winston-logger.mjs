import winston from 'winston';
import LoggerInterface from './logger-interface.mjs';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format for development logging (colored, stack traces, etc.)
const devConsoleFormat = printf(info => {
    let output = `${info.timestamp} [${info.level}]: ${info.message}`;
    if (info.stack) output += `\n${info.stack}`;
    return output;
});

// Format for production logging (structured JSON)
const prettyJsonFormat = printf(info => {
    return JSON.stringify(info, null, 4);
});

// Check environment
const isProduction = process.env.NODE_ENV === 'production';

// Set log level via env or default to 'debug'
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

const SERVICE_NAME = process.env.SERVICE_NAME || 'service-name';

// Console transport setup
const consoleTransport = new winston.transports.Console({
    level: LOG_LEVEL,
    format: isProduction
        ? combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            prettyJsonFormat
        )
        : combine(
            colorize({ all: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            devConsoleFormat
        )
});

// Winston base logger instance
const baseLogger = winston.createLogger({
    level: LOG_LEVEL,
    levels: winston.config.npm.levels,
    transports: [consoleTransport],
    defaultMeta: { service: SERVICE_NAME }
});

/**
 * WinstonLogger implements LoggerInterface to abstract away Winston usage.
 * This allows Winston to be swapped out with another logger (e.g., Pino) later.
 */
class WinstonLogger extends LoggerInterface {
    info(message, meta = {}) {
        baseLogger.info(message, meta);
    }

    warn(message, meta = {}) {
        baseLogger.warn(message, meta);
    }

    error(message, meta = {}) {
        baseLogger.error(message, meta);
    }

    debug(message, meta = {}) {
        baseLogger.debug(message, meta);
    }

    log(level, message, meta = {}) {
        baseLogger.log(level, message, meta);
    }
}

export default new WinstonLogger();

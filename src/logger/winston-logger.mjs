import winston from 'winston';
import LoggerInterface from './logger-interface.mjs';
import {settings} from "../config/settings.mjs";

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
const isProduction = settings.app.ENV === 'production';

// Set log level via env or default to 'debug'
const LOG_LEVEL = settings.logs.LOG_LEVEL;

const SERVICE_NAME = settings.app.SERVICE_NAME;

// Console transport setup
const transport = new winston.transports.Console({
    level: LOG_LEVEL,
    format: isProduction
        ? combine(
            timestamp({ format: settings.logs.DATE_FORMAT }),
            errors({ stack: true }),
            prettyJsonFormat
        )
        : combine(
            colorize({ all: true }),
            timestamp({ format: settings.logs.DATE_FORMAT }),
            errors({ stack: true }),
            devConsoleFormat
        )
});

// Winston base logger instance
const baseLogger = winston.createLogger({
    level: LOG_LEVEL,
    levels: winston.config.npm.levels,
    transports: [transport],
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

/**
 * Application-wide Winston logger instance.
 *
 * Provides structured logging functionality with multiple transport options
 * and configurable log levels. Use this instance throughout the application
 * for consistent logging behavior.
 *
 * @type {WinstonLogger}
 */
const logger = new WinstonLogger();

export default logger;

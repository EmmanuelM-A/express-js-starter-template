/**
 * @module DevEnvConfig
 * @description
 * Development environment configuration and schema definition.
 *
 * The config object holds default values for development.
 * The Joi schema ensures validation of environment variables and applies defaults
 * where necessary.
 */

import Joi from "joi";

/**
 * Development environment configuration defaults.
 * These are applied before validation to ensure the app
 * has sensible defaults in development mode.
 */
export const DevEnvConfig = {
    // Server
    PORT: 5000,

    // Logs
    LOG_LEVEL: "debug",
    LOG_FORMAT: (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    LOG_DATE_FORMAT: "%Y-%m-%d %H:%M:%S",
    IS_FILE_LOGGING_ENABLED: false,

    // Security (extend later)
    // Docs (extend later)
};

/**
 * Joi schema for validating and enforcing development environment configuration.
 * Use this with ConfigValidator to ensure the config is valid at runtime.
 */
export const DevEnvConfigSchema = Joi.object({
    // Server
    PORT: Joi.number().default(5000),

    // Logs
    LOG_LEVEL: Joi.string()
        .default("debug"),

    // Note: Joi does not validate functions, so we treat LOG_FORMAT as optional passthrough
    LOG_FORMAT: Joi.any().default(DevEnvConfig.LOG_FORMAT),

    LOG_DATE_FORMAT: Joi.string().default("%Y-%m-%d %H:%M:%S"),
    IS_FILE_LOGGING_ENABLED: Joi.boolean().default(false),

    // Security (extend later)
    // Docs (extend later)
});
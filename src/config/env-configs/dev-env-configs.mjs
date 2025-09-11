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
import dotenv from "dotenv";

dotenv.config({ path: "../.env.development" });

/**
 * Development environment variables and configuration defaults.
 * These are applied before validation to ensure the app
 * has sensible defaults in development mode.
 */
export const DevEnvConfig = {
    // Server
    PORT: parseInt(process.env.PORT) || 5000,

    // Logs
    LOG_LEVEL: process.env.LOG_LEVEL || "debug",
    LOG_FORMAT: (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    LOG_DATE_FORMAT: "%Y-%m-%d %H:%M:%S",
    IS_FILE_LOGGING_ENABLED: process.env.IS_FILE_LOGGING_ENABLED === "true",
};

/**
 * Joi schema for validating and enforcing development environment configuration.
 * Use this with ConfigValidator to ensure the config is valid at runtime.
 */
export const DevEnvConfigSchema = Joi.object({
    // Server
    PORT: Joi.number().default(5000),

    // Logs
    LOG_LEVEL: Joi.string().default("debug"),
    LOG_FORMAT: Joi.any().default(DevEnvConfig.LOG_FORMAT),
    LOG_DATE_FORMAT: Joi.string().default("%Y-%m-%d %H:%M:%S"),
    IS_FILE_LOGGING_ENABLED: Joi.boolean().default(false),
});
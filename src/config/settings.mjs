/**
 * @module settings
 * @description
 * Centralized application-wide configuration object.
 *
 * This module loads environment variables, validates them against
 * the chosen environment's schema, and exports a structured `settings`
 * object for use across the application.
 *
 * Usage:
 * ```js
 * import { settings } from "./settings.mjs";
 * console.log(settings.server.PORT);
 * ```
 */

import { ConfigValidator } from "./config-validator.mjs";

const NODE_ENV = process.env.NODE_ENV || "development";

const envSettings = ConfigValidator.getConfig(NODE_ENV);

/**
 * Application-wide configuration settings.
 * Values here should be consumed instead of directly using `process.env`
 * to ensure consistency and validation across the application.
 */
export const settings = {
    /**
     * General application settings.
     */
    app: {
        ENV: NODE_ENV,
        SERVICE_NAME: "express-starter-template",
        SERVICE_URL: ""
    },

    /**
     * Server-related configuration.
     */
    server: {
        DEFAULT_PORT: 5009,
        PORT: envSettings.PORT,
    },

    /**
     * Logging configuration (structured in future).
     */
    logs: {
        LOG_LEVEL: envSettings.LOG_LEVEL || "info",
        LOG_DIRECTORY: "../logs",
        LOG_FORMAT: envSettings.LOG_FORMAT,
        LOG_DATE_FORMAT: "%Y-%m-%d %H:%M:%S",
        IS_FILE_LOGGING_ENABLED: envSettings.IS_FILE_LOGGING_ENABLED || false,
    },

    /**
     * Security-related configuration (e.g., CORS, rate limiting).
     */
    security: {},

    /**
     * API documentation (Swagger/OpenAPI, etc.).
     */
    docs: {},

    /**
     * Database configuration (host, port, credentials, etc.).
     */
    database: {},
};
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
import {settings} from "express/lib/application.js";

const envVars = process.env;

const NODE_ENV = envVars.NODE_ENV || "development";

const envSettings = ConfigValidator.getConfig(NODE_ENV);

/**
 * Application-wide configuration settings.
 * Values here should be consumed instead of directly using `process.env`
 * to ensure consistency and validation across the application.
 */
export const settings = {
    /**
     * Default port if none is defined in environment configuration.
     * @type {number}
     */
    DEFAULT_PORT: 5000,

    /**
     * General application settings.
     */
    app: {
        ENV: NODE_ENV,
        APP_NAME: "express-starter-template",
    },

    /**
     * Server-related configuration.
     */
    server: {
        DEFAULT_PORT: 5000,
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
        IS_FILE_LOGGING_ENABLED: false,
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
/**
 * @module settings
 * @description
 * Centralized application-wide configuration and settings object.
 +
 */

// TODO: CONSIDER ADDING ENV VALIDATION

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

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
        ENV: process.env.NODE_ENV || "development",
        SERVICE_NAME: "express-starter-template",
        SERVICE_URL: ""
    },

    /**
     * Server-related configuration.
     */
    server: {
        PORT: process.env.PORT || 5000,
    },

    /**
     * Logging configuration (structured in future).
     */
    logs: {
        LOG_LEVEL: "info",
        LOG_DIRECTORY: "../logs",
        CONSOLE_LOG_FORMAT: (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
        FILE_LOG_FORMAT: "",
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
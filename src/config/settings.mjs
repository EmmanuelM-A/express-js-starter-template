
const envVars = process.env;

/**
 * Application wide settings and configurations.
 */
export const settings = {
    DEFAULT_PORT: 5000,
    app: {
        env: envVars.NODE_ENV
    },
    server: {},
    logs: {},
    security: {},
    docs: {},
    database: {}
};
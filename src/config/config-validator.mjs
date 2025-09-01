/**
 * @module ConfigValidator
 * @description
 * Provides utilities to validate and retrieve environment-specific configuration
 * settings for different runtime environments (development, production, staging, test).
 *
 * This helps ensure that required environment variables are present and correctly
 * structured before the application starts.
 */

import {
    DevEnvSettings,
    ProdEnvSettings,
    StagEnvSettings,
    TestEnvSettings
} from "./env-settings.mjs";

import logger from "../logger/winston-logger.mjs";
import {DevEnvConfig, DevEnvConfigSchema} from "./env-configs/dev-env-settings.mjs";

/**
 * ConfigValidator is responsible for validating environment variables
 * against a given schema and returning environment-specific configuration
 * objects.
 */
export class ConfigValidator {

    /**
     * Validates the provided environment variables against a Joi (or similar) schema.
     *
     * @param {Object} schema Validation schema (e.g., Joi schema) that defines required environment variables.
     * @param {Object} [env=process.env] The environment variables to validate. Defaults to process.env.
     * @returns {boolean} True if validation passes, false otherwise. // FIXME UPDATE DOCUMENTATION
     */
    static validate(schema, env = process.env) {
        const { error, value: envVars } = schema.validate(env);

        if (error) {
            logger.error(`Config validation error: ${error.message || error}`);
            // Throw an error
        }

        return envVars;
    }

    /**
     * Retrieves the configuration object for the specified environment.
     *
     * @param {"development"|"production"|"staging"|"test"} environment The target environment.
     * @returns {Object} The corresponding configuration settings.
     * @throws {Error} If the environment is not recognized. // FIXME:
     */
    static getConfig(environment) {
        switch (environment) {
            case "development":
                // return ConfigValidator.validate(DevEnvConfigSchema, DevEnvConfig);
                return DevEnvConfig;
            case "production":
                return ProdEnvSettings;
            case "test":
                return TestEnvSettings;
            case "staging":
                return StagEnvSettings;
            default:
                logger.error(`Invalid environment: ${environment}`);
                //throw new Error(`Unknown environment: ${environment}`);
        }
    }
}
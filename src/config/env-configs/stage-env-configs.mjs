/**
 * @module StageEnvConfig
 * @description
 * Staging environment configuration and schema definition.
 *
 * The config object holds default values for the staging environment.
 * The Joi schema ensures validation of environment variables and applies defaults
 * where necessary.
 */

import Joi from "joi";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.staging" });

/**
 * Staging environment variables and configuration defaults.
 * These are applied before validation to ensure the app
 * has sensible defaults in staging mode.
 */
export const StageEnvConfig = {};

/**
 * Joi schema for validating and enforcing development environment configuration.
 * Use this with ConfigValidator to ensure the config is valid at runtime.
 */
export const StageEnvConfigSchema = Joi.object({});
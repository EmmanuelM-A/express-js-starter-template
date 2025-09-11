/**
 * @module ProdEnvConfig
 * @description
 * Production environment configuration and schema definition.
 *
 * The config object holds default values for production.
 * The Joi schema ensures validation of environment variables and applies defaults
 * where necessary.
 */

import Joi from "joi";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.production" });

/**
 * Production environment variables and configuration defaults.
 * These are applied before validation to ensure the app
 * has sensible defaults in production mode.
 */
export const ProdEnvConfig = {};

/**
 * Joi schema for validating and enforcing production environment configuration.
 * Use this with `ConfigValidator` to ensure the config is valid at runtime.
 */
export const ProdEnvConfigSchema = Joi.object({});
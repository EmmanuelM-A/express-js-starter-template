/**
 * @module TestEnvConfig
 * @description
 * Test environment configuration and schema definition.
 *
 * The config object holds default values for tests.
 * The Joi schema ensures validation of environment variables and applies defaults
 * where necessary.
 */

import Joi from "joi";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.tests" });

/**
 * Test environment variables and configuration defaults.
 * These are applied before validation to ensure the app
 * has sensible defaults in test mode.
 */
export const TestEnvConfig = {};

/**
 * Joi schema for validating and enforcing test environment configuration.
 * Use this with `ConfigValidator` to ensure the config is valid at runtime.
 */
export const TestEnvConfigSchema = Joi.object({});
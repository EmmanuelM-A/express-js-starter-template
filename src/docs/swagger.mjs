import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../logger/winston-logger.mjs";
import { settings } from "../config/settings.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sets up Swagger documentation on the Express app.
 * Loads and resolves all references in the OpenAPI YAML.
 * 
 * @param {import('express').Express} app - The Express application instance.
 */
export const setupSwaggerDocs = async (app) => {
    const swaggerDocument = YAML.load(path.resolve(__dirname, "bundled-swagger.yaml"));

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const DOCS_URL = process.env.SERVICE_URL?.trim() !== ''
        ? `${process.env.SERVICE_URL}/api-docs` : `http://localhost:${process.env.PORT || settings.DEFAULT_PORT}/api-docs`;

    logger.info(`Swagger docs available at ${DOCS_URL}`)
}

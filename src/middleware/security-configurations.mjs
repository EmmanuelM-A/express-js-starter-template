import {helmetConfigurations} from "./helmet-configuration.mjs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {settings} from "../config/settings.mjs";
import {corsConfigurations} from "./cors-configuration.mjs";
import cors from "cors";
import express from "express";

/**
 * Configures security-related middleware for the Express application.
 * This includes helmet for HTTP headers, CORS, cookie parsing, and body parsing with size limits.
 *
 * @param {Express} app - The Express application instance
 */
export const setupSecurity = (app) => {
    // Security headers
    app.use(helmet(helmetConfigurations));

    // Cookie parsing
    app.use(cookieParser());

    // Body parsing with size limits
    app.use(express.json({ limit: settings.app.JSON_REQUEST_SIZE_LIMIT }));
    app.use(express.urlencoded({
        extended: true,
        limit: settings.app.JSON_REQUEST_SIZE_LIMIT
    }));

    // Cross-Origin Resource Sharing
    app.use(cors(corsConfigurations));
};
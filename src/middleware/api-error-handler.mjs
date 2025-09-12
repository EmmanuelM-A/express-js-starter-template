/**
 * A middleware that handles all errors that could occur in the application.
 */

import express from 'express';
import logger from '../logger/winston-logger.mjs';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../utils/response-delivery.mjs';
import { COMMON_ERRORS } from '../config/errors.mjs';
import ApiError from "../errors/api-error.mjs";

/**
 * Global Express error-handling middleware. This function intercepts thrown or passed errors from any middleware or route handler.
 * It maps the error to a standardized JSON response structure and sets the appropriate HTTP status code.
 * 
 * It ensures consistent error response formatting across the entire application and includes detailed debugging information
 * in development environments while keeping the output clean and safe in production.
 *
 * @param {ApiError} error - The error object caught by Express.
 * @param {express.Request} request - The Express request object.
 * @param {express.Response} response - The Express response object used to send the formatted error.
 * @param {express.NextFunction} next - The next middleware function (typically unused here but required by Express).
 * @returns {void}
 */
export const apiErrorHandler = (error, request, response, next) => {
    // Delegate to Express's built-in error handler if no header set
    if (response.headersSent) return next(error);

    if (!(error instanceof ApiError)) return next(error);

    // Ensure response status is an error, defaulting to 500
    const statusCode =  error.status && (error.status >= 400 && error.status < 600)
        ? error.status
        : StatusCodes.INTERNAL_SERVER_ERROR;

    const fallback = COMMON_ERRORS[statusCode] || COMMON_ERRORS[StatusCodes.INTERNAL_SERVER_ERROR];

    const errorLog = {
        message: error.message || fallback.message,
        error: {
            code: error.code || fallback.code,
            details: error.details || fallback.details,
        },
        url: request.originalUrl,
        method: request.method,
    };

    if(process.env.NODE_ENV === "development") {
        errorLog.stackTrace = error.stack;
    }

    logger.error(errorLog);

    sendErrorResponse(
        response,
        statusCode,
        error.message || fallback.message,
        error.code || fallback.code,
        error.details || fallback.details,
        error.stack
    );
}

/**
 * Handles any unhandled or unexpected errors.
 */
export const unhandledErrorHandler = (error, request, response, next) => {
    // Delegate to Express's built-in error handler if no header set
    if (response.headersSent) return next(error);

    const errorResponse = {
        message: 'Something went wrong',
        error: { code: 'UNHANDLED_ERROR' },
    };

    const errorLog = {
        message: error.message || 'Unhandled error',
        stack: error.stack,
        url: request.originalUrl,
        method: request.method,
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stackTrace = error.stack;
    }

    logger.error(errorLog);

    sendErrorResponse(
        response,
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorResponse.message,
        errorResponse.error.code,
        errorResponse.error.details,
        errorResponse.stackTrace
    );
}


/**
 * Registers all error handlers in the correct order.
 *
 * @param app The express application instance.
 */
export const setupErrorHandlers = (app) => {
    // Handles known ApiErrors
    app.use(apiErrorHandler);

    // Final fallback for unhandled errors
    app.use(unhandledErrorHandler);
}
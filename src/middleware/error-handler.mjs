/**
 * A middleware that handles all errors that could occur in the application.
 */

import express from 'express';
import logger from '../logger/winston-logger.mjs';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../utils/response-structure.mjs';
import { COMMON_ERRORS_MAP } from '../config/common-errors.mjs';

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
export const errorHandler = (error, request, response, next) => {
    // Delegate to Express's built-in error handler if no header set
    if (response.headersSent) {
        return next(error);
    }

    // Ensure response status is an error, defaulting to 500
    const statusCode = error.status >= 400 && error.status < 500 ? error.status: 500;

    // Get specific error details from the map, or use default server error
    const errorDetails = COMMON_ERRORS_MAP[statusCode] || COMMON_ERRORS_MAP[StatusCodes.INTERNAL_SERVER_ERROR];

    const errorResponse = {
        message: error.message || errorDetails.message,
        error: {
            code: error.code || errorDetails.code,
            details: error.details || errorDetails.details,
        },
    };

    const errorLog = {
        message: error.message || errorDetails.message,
        error: errorResponse.error,
        url: request.originalUrl,
        method: request.method,
    };

    if(process.env.NODE_ENV === "development") {
        errorResponse.stackTrace = error.stack;
        errorLog.stackTrace = error.stack;
    }

    logger.error(errorLog);

    sendErrorResponse(response, statusCode, errorResponse.message, errorResponse.error.code, errorResponse.error.details, errorResponse.stackTrace);
}
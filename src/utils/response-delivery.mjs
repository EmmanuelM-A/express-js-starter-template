/**
 * Responsible for the structuring of the http response objects.
 * This module provides functions to create standardized response 
 * formats. 
 */

import express, {response} from 'express';
import {ApiErrorResponse, ApiSuccessResponse} from "./api-response.mjs";



/**
 * Sets the status code and sends a standardized success response.
 * 
 * @param {express.Response} response The Express response object.
 * @param {number} statusCode The HTTP status code for the response.
 * @param {string} message The success message to include in the response.
 * @param {object} data The data to include in the response (optional).
 * 
 * @returns {void}
 */
export const sendSuccessResponse = (response, statusCode, message, data = null) => {
    const successResponse = new ApiSuccessResponse(message, data);

	response.status(statusCode).json(successResponse.toJson());
};

/**
 * Sets the status code and sends a standardized error response. 
 * 
 * @param {express.Response} response The Express response object.
 * @param {number} statusCode The HTTP status code for the response.
 * @param {string} message The error message to include in the response.
 * @param {string} code The error code to include in the response.
 * @param {null} details The error details to include in the response (optional).
 * @param {null} stackTrace The stack trace to include in the response (optional, useful for debugging in development).
 * 
 * @returns {void}
 */
export const sendErrorResponse = (response, statusCode, message, code, details = null, stackTrace = null) => {
    const errorResponse = new ApiErrorResponse(message, code, details, stackTrace);

    response.status(statusCode).json(errorResponse.toJson());
};

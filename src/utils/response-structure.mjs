/**
 * Responsible for the structuring of the http response objects.
 * This module provides functions to create standardized response 
 * formats. 
 */

import express from 'express';


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
	response.status(statusCode).json({
		success: true,
		message,
		...(data && { data }),
	});
};

/**
 * Sets the status code and sends a standardized error response. 
 * 
 * @param {express.Response} response The Express response object.
 * @param {number} statusCode The HTTP status code for the response.
 * @param {string} message The error message to include in the response.
 * @param {string} code The error code to include in the response (optional).
 * @param {string} details The error details to include in the response (optional).
 * @param {string} stackTrace The stack trace to include in the response (optional, useful for debugging in development).
 * 
 * @returns {void}
 */
export const sendErrorResponse = (response, statusCode, message, code = null, details = null, stackTrace = null) => {
	// Build the response body with the consistent structure
    const responseBody = {
        success: false,
        message: message,
        error: {}
    };

    // Add code and details if they are provided
    if (code) responseBody.error.code = code;
    if (details) responseBody.error.details = details;
	
	if( process.env.NODE_ENV === 'development') {
		// In development, include the stack trace for debugging
		responseBody.stackTrace = stackTrace;
	}

    // Send the response with the specified status code and JSON body
    response.status(statusCode).json(responseBody);
};

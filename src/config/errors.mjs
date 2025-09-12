import { StatusCodes } from 'http-status-codes';

/**
 * Common error mappings used throughout the application.
 * Provides standardized error structure for known HTTP status codes.
 */
export const COMMON_ERRORS = {
    [StatusCodes.BAD_REQUEST]: {
        message: 'Bad request',
        code: 'BAD_REQUEST',
        details: 'The request was invalid'
    },

    [StatusCodes.UNAUTHORIZED]: {
        message: 'Authentication required or invalid credentials.',
        code: 'UNAUTHORIZED',
        details: 'You are not authorized to access this resource.'
    },

    [StatusCodes.FORBIDDEN]: {
        message: 'Access denied.',
        code: 'FORBIDDEN',
        details: 'You do not have permission to perform this action.'
    },

    [StatusCodes.NOT_FOUND]: {
        message: 'Resource not found.',
        code: 'NOT_FOUND',
        details: 'The requested resource could not be found.'
    },

    [StatusCodes.CONFLICT]: {
        message: 'Conflict detected.',
        code: 'RESOURCE_CONFLICT',
        details: 'A resource with this identifier already exists.'
    },

    [StatusCodes.UNPROCESSABLE_ENTITY]: {
        message: 'Unprocessable request.',
        code: 'UNPROCESSABLE_ENTITY',
        details: 'The server understands the request but was unable to process it.'
    },

    [StatusCodes.TOO_MANY_REQUESTS]: {
        message: 'Too many requests.',
        code: 'RATE_LIMITED',
        details: 'You have exceeded the number of allowed requests. Please try again later.'
    },

    [StatusCodes.SERVICE_UNAVAILABLE]: {
        message: 'Service temporarily unavailable.',
        code: 'SERVICE_UNAVAILABLE',
        details: 'The service is under maintenance or temporarily overloaded.'
    },

    [StatusCodes.GATEWAY_TIMEOUT]: {
        message: 'Gateway timeout.',
        code: 'GATEWAY_TIMEOUT',
        details: 'The server did not receive a timely response from an upstream service.'
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
        message: 'An internal server error occurred.',
        code: 'INTERNAL_SERVER_ERROR',
        details: 'Something went wrong on our server.'
    }
};

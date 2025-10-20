import { StatusCodes } from 'http-status-codes';
import ApiError from "./api-error.mjs";


export const throwBadRequestError = (message = 'Bad request', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.BAD_REQUEST, errorCode, details);
};

export const throwUnprocessableEntityError = (message = 'Validation failed', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.UNPROCESSABLE_ENTITY, errorCode, details);
};

export const throwNotFoundError = (message = 'Resource not found', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.NOT_FOUND, errorCode, details);
};

export const throwUnauthorizedError = (message = 'Unauthorized', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.UNAUTHORIZED, errorCode, details);
};

export const throwForbiddenError = (message = 'Forbidden', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.FORBIDDEN, errorCode, details);
};

export const throwDatabaseError = (message = 'Database error', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR, errorCode, details);
};

export const throwFileNotFoundError = (message = 'File not found', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.NOT_FOUND, errorCode, details);
};

export const throwConflictError = (message = 'Resource conflict', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.CONFLICT, errorCode, details);
};

export const throwInternalServerError = (message = 'An error occurred in the server', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR, errorCode, details);
}

export const throwRateLimitError = (message = 'Too many requests', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.TOO_MANY_REQUESTS, errorCode, details);
};

export const throwServiceUnavailableError = (message = 'Service temporarily unavailable', errorCode, details = null) => {
    throw new ApiError(message, StatusCodes.SERVICE_UNAVAILABLE, errorCode, details);
};

export const throwGatewayTimeoutError = (message = 'Gateway timeout', errorCode = 'GATEWAY_TIMEOUT', details = null) => {
    throw new ApiError(message, StatusCodes.GATEWAY_TIMEOUT, errorCode, details);
};

export const throwBadGatewayError = (message = 'Bad gateway', errorCode = 'BAD_GATEWAY', details = null) => {
    throw new ApiError(message, StatusCodes.BAD_GATEWAY, errorCode, details);
};
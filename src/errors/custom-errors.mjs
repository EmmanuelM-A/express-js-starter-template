import { StatusCodes } from 'http-status-codes';
import ApiError from "./api-error.mjs";


export const BadRequestError = (message = 'Bad request', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.BAD_REQUEST, errorCode, details);
};

export const ValidationError = (message = 'Validation failed', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.UNPROCESSABLE_ENTITY, errorCode, details);
};

export const NotFoundError = (message = 'Resource not found', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.NOT_FOUND, errorCode, details);
};

export const UnauthorizedError = (message = 'Unauthorized', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.UNAUTHORIZED, errorCode, details);
};

export const ForbiddenError = (message = 'Forbidden', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.FORBIDDEN, errorCode, details);
};

export const DatabaseError = (message = 'Database error', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR, errorCode, details);
};

export const FileNotFoundError = (message = 'File not found', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.NOT_FOUND, errorCode, details);
};

export const ConflictError = (message = 'Resource conflict', errorCode, details = null) => {
    return new ApiError(message, StatusCodes.CONFLICT, errorCode, details);
};
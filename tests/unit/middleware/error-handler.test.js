/**
 * Unit tests for the error handler middleware
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { errorHandler, unhandledErrorHandler, setupErrorHandlers } from '../../../src/middleware/error-handler.mjs';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../../../src/utils/response-delivery.mjs';
import logger from '../../../src/logger/winston-logger.mjs';
import ApiError from '../../../src/errors/api-error.mjs';

// Mock modules using Vitest's `vi.mock`
vi.mock('../../../src/utils/response-delivery.mjs', () => ({
    sendErrorResponse: vi.fn()
}));
vi.mock('../../../src/logger/winston-logger.mjs', () => ({
    default: {
        error: vi.fn(),
    },
}));

describe('Error Handler Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let originalNodeEnv;

    const BASE_URL = '/test-endpoint';
    const METHOD = 'POST';

    beforeEach(() => {
        originalNodeEnv = process.env.NODE_ENV;
        vi.clearAllMocks();

        mockReq = {
            originalUrl: BASE_URL,
            method: METHOD
        };
        mockRes = {
            headersSent: false,
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
        mockNext = vi.fn();
    });

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    describe('errorHandler', () => {
        it('should skip handling if headers have already been sent', () => {
            const error = new ApiError('Headers already sent', StatusCodes.BAD_REQUEST);
            mockRes.headersSent = true;

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
            expect(sendErrorResponse).not.toHaveBeenCalled();
            expect(logger.error).not.toHaveBeenCalled();
        });

        it('should pass non-ApiError to next middleware', () => {
            const error = new Error('Regular error');

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
            expect(sendErrorResponse).not.toHaveBeenCalled();
            expect(logger.error).not.toHaveBeenCalled();
        });

        it('should handle ApiError with all properties', () => {
            const error = new ApiError(
                'Invalid user input',
                StatusCodes.BAD_REQUEST,
                'INVALID_INPUT',
                'Email format is incorrect'
            );

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.BAD_REQUEST,
                'Invalid user input',
                'INVALID_INPUT',
                'Email format is incorrect',
                error.stack
            );

            expect(logger.error).toHaveBeenCalledWith(
                'Invalid user input',
                expect.objectContaining({
                    error: {
                        code: 'INVALID_INPUT',
                        details: 'Email format is incorrect'
                    },
                    url: BASE_URL,
                    method: METHOD
                })
            );
        });

        it('should fall back to COMMON_ERRORS when error properties are missing', () => {
            const error = new ApiError('', StatusCodes.NOT_FOUND, '', '');

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.NOT_FOUND,
                'Resource not found.',
                'NOT_FOUND',
                'The requested resource could not be found.',
                error.stack
            );
        });

        it('should default to 500 if status is invalid', () => {
            const error = new ApiError('Invalid status', 200); // 200 is not an error status

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Invalid status',
                expect.any(String),
                expect.any(String),
                error.stack
            );
        });

        it('should include stack trace in development mode', () => {
            process.env.NODE_ENV = 'development';
            const error = new ApiError(
                'Auth error',
                StatusCodes.UNAUTHORIZED,
                'AUTH_FAIL',
                'Token expired'
            );

            errorHandler(error, mockReq, mockRes, mockNext);

            expect(logger.error).toHaveBeenCalledWith(
                'Auth error',
                expect.objectContaining({
                    stackTrace: error.stack
                })
            );
        });

        it('should NOT include stack trace in production mode', () => {
            process.env.NODE_ENV = 'production';
            const error = new ApiError(
                'Auth error',
                StatusCodes.UNAUTHORIZED,
                'AUTH_FAIL',
                'Token expired'
            );

            errorHandler(error, mockReq, mockRes, mockNext);

            const loggerCall = logger.error.mock.calls[0][1];
            expect(loggerCall).not.toHaveProperty('stackTrace');
        });

        it('should handle different status codes correctly', () => {
            const testCases = [
                { status: StatusCodes.BAD_REQUEST, message: 'Bad request' },
                { status: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' },
                { status: StatusCodes.FORBIDDEN, message: 'Forbidden' },
                { status: StatusCodes.NOT_FOUND, message: 'Not found' },
                { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal error' }
            ];

            testCases.forEach(({ status, message }) => {
                vi.clearAllMocks();
                const error = new ApiError(message, status);

                errorHandler(error, mockReq, mockRes, mockNext);

                expect(sendErrorResponse).toHaveBeenCalledWith(
                    mockRes,
                    status,
                    expect.any(String),
                    expect.any(String),
                    expect.any(String),
                    error.stack
                );
            });
        });
    });

    describe('unhandledErrorHandler', () => {
        it('should skip handling if headers have already been sent', () => {
            const error = new Error('Headers already sent');
            mockRes.headersSent = true;

            unhandledErrorHandler(error, mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
            expect(sendErrorResponse).not.toHaveBeenCalled();
            expect(logger.error).not.toHaveBeenCalled();
        });

        it('should handle unhandled errors with default message', () => {
            const error = new Error('Unexpected error');

            unhandledErrorHandler(error, mockReq, mockRes, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong',
                'UNHANDLED_ERROR',
                undefined,
                undefined
            );

            expect(logger.error).toHaveBeenCalledWith(
                'Unexpected error',
                expect.objectContaining({
                    message: 'Unexpected error',
                    stack: error.stack,
                    url: BASE_URL,
                    method: METHOD
                })
            );
        });

        it('should include stack trace in development mode for unhandled errors', () => {
            process.env.NODE_ENV = 'development';
            const error = new Error('Unhandled error');

            unhandledErrorHandler(error, mockReq, mockRes, mockNext);

            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong',
                'UNHANDLED_ERROR',
                undefined,
                error.stack
            );
        });

        it('should NOT include stack trace in production mode for unhandled errors', () => {
            process.env.NODE_ENV = 'production';
            const error = new Error('Unhandled error');

            unhandledErrorHandler(error, mockReq, mockRes, mockNext);

            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Something went wrong',
                'UNHANDLED_ERROR',
                undefined,
                undefined
            );
        });

        it('should handle errors without message', () => {
            const error = new Error();

            unhandledErrorHandler(error, mockReq, mockRes, mockNext);

            expect(logger.error).toHaveBeenCalledWith(
                'Unhandled error',
                expect.objectContaining({
                    message: 'Unhandled error'
                })
            );
        });
    });

    describe('setupErrorHandlers', () => {
        it('should register both error handlers in correct order', () => {
            const mockApp = {
                use: vi.fn()
            };

            setupErrorHandlers(mockApp);

            expect(mockApp.use).toHaveBeenCalledTimes(2);
            expect(mockApp.use).toHaveBeenNthCalledWith(1, errorHandler);
            expect(mockApp.use).toHaveBeenNthCalledWith(2, unhandledErrorHandler);
        });

        it('should be callable with an Express app', () => {
            const mockApp = {
                use: vi.fn()
            };

            expect(() => setupErrorHandlers(mockApp)).not.toThrow();
            expect(mockApp.use).toHaveBeenCalled();
        });
    });
});
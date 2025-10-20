/**
 * Unit tests for the errorHandler middleware
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { errorHandler } from '../../../src/middleware/error-handler.mjs';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../../../src/utils/response-delivery.mjs';
import logger from '../../../src/logger/winston-logger.mjs';

// Mock modules using Vitest's `vi.mock`
vi.mock('../../../src/utils/response-delivery.mjs', () => ({
    sendErrorResponse: vi.fn()
}));
vi.mock('../../../src/logger/winston-logger.mjs', () => ({
    default: {
        error: vi.fn(),
    },
}));

describe('errorHandler middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let originalNodeEnv; // To store the original NODE_ENV

    const BASE_URL = '/test-endpoint';
    const METHOD = 'POST';

    beforeEach(() => {
        // Store and clear mocks before each test
        originalNodeEnv = process.env.NODE_ENV;
        vi.clearAllMocks();

        mockReq = {
            originalUrl: BASE_URL,
            method: METHOD
        };
        mockRes = {
            headersSent: false,
            // Use vi.fn() for mock functions
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
        mockNext = vi.fn();
    });

    // Restore the original environment after each test
    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    // This helper function remains the same as its logic is framework-agnostic
    const callWithError = ({
        error,
        expectedStatus,
        expectedMessage,
        expectedCode,
        expectedDetails,
        expectedStackTrace
    }) => {
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalled();

        expect(sendErrorResponse).toHaveBeenCalledWith(
            mockRes,
            expectedStatus,
            expectedMessage,
            expectedCode,
            expectedDetails,
            expectedStackTrace
        );

        expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
            message: expectedMessage,
            error: {
                code: expectedCode,
                details: expectedDetails
            },
            url: BASE_URL,
            method: METHOD,
            ...(expectedStackTrace ? { stackTrace: expectedStackTrace } : {})
        }));
    };

    it('should skip handling if headers have already been sent', () => {
        const error = new Error('Headers already sent');
        mockRes.headersSent = true;

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(sendErrorResponse).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
    });

    it('should default to internal server error for unknown error', () => {
        const error = new Error('Unexpected failure');

        callWithError({
            error,
            expectedStatus: StatusCodes.INTERNAL_SERVER_ERROR,
            expectedMessage: 'Unexpected failure',
            expectedCode: 'INTERNAL_SERVER_ERROR',
            expectedDetails: 'Something went wrong on our server.',
            expectedStackTrace: undefined
        });
    });

    it('should handle known client error with custom message and code', () => {
        const error = {
            status: StatusCodes.BAD_REQUEST,
            message: 'Invalid user input',
            code: 'INVALID_INPUT',
            details: { field: 'email', issue: 'format' }
        };

        callWithError({
            error,
            expectedStatus: StatusCodes.BAD_REQUEST,
            expectedMessage: 'Invalid user input',
            expectedCode: 'INVALID_INPUT',
            expectedDetails: { field: 'email', issue: 'format' },
            expectedStackTrace: undefined
        });
    });

    it('should fall back to default message and details if missing', () => {
        const error = {
            status: StatusCodes.BAD_REQUEST
        };

        callWithError({
            error,
            expectedStatus: StatusCodes.BAD_REQUEST,
            expectedMessage: 'Bad request',
            expectedCode: 'BAD_REQUEST',
            expectedDetails: 'The request was invalid',
            expectedStackTrace: undefined
        });
    });

    it('should attach stack trace in development mode', () => {
        process.env.NODE_ENV = 'development';
        const stack = 'stack trace here';
        const error = {
            status: StatusCodes.UNAUTHORIZED,
            message: 'Auth error',
            code: 'AUTH_FAIL',
            details: 'Token expired',
            stack
        };

        callWithError({
            error,
            expectedStatus: StatusCodes.UNAUTHORIZED,
            expectedMessage: 'Auth error',
            expectedCode: 'AUTH_FAIL',
            expectedDetails: 'Token expired',
            expectedStackTrace: stack
        });
    });

    it('should NOT attach stack trace in production mode', () => {
        process.env.NODE_ENV = 'production';
        const error = {
            status: StatusCodes.UNAUTHORIZED,
            message: 'Auth error',
            code: 'AUTH_FAIL',
            details: 'Token expired',
            stack: 'should not be exposed'
        };

        callWithError({
            error,
            expectedStatus: StatusCodes.UNAUTHORIZED,
            expectedMessage: 'Auth error',
            expectedCode: 'AUTH_FAIL',
            expectedDetails: 'Token expired',
            expectedStackTrace: undefined
        });
    });

    it('should default to 500 if status is below 400', () => {
        const error = {
            status: StatusCodes.OK,
            message: 'This is not an error'
        };

        callWithError({
            error,
            expectedStatus: StatusCodes.INTERNAL_SERVER_ERROR,
            expectedMessage: 'This is not an error',
            expectedCode: 'INTERNAL_SERVER_ERROR',
            expectedDetails: 'Something went wrong on our server.',
            expectedStackTrace: undefined
        });
    });
});
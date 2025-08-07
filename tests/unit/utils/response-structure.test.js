/**
 * Tests for HTTP response utility functions
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { sendSuccessResponse, sendErrorResponse } from '../../../src/utils/response-structure.mjs';
import { StatusCodes } from 'http-status-codes';

/**
 * Creates a mock express response object.
 *
 * @returns An object with response data.
 */
const createMockResponse = () => {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };
}

describe('HTTP Response Utilities', () => {
    let mockResponse;
    let originalNodeEnv;

    beforeEach(() => {
        mockResponse = createMockResponse();
        originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
        vi.clearAllMocks();
        process.env.NODE_ENV = originalNodeEnv;
    });

    describe('sendSuccessResponse', () => {
        it('should send a success response with message only', () => {
            const statusCode = StatusCodes.OK;
            const message = 'Operation successful';

            sendSuccessResponse(mockResponse, statusCode, message);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
            });
        });

        it('should send a success response with message and data', () => {
            const statusCode = StatusCodes.CREATED;
            const message = 'Resource created';
            const data = { id: 1, name: 'Test Resource' };

            sendSuccessResponse(mockResponse, statusCode, message, data);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
                data: data,
            });
        });

        it('should not include data property when data is null', () => {
            const statusCode = StatusCodes.OK;
            const message = 'Success without data';

            sendSuccessResponse(mockResponse, statusCode, message, null);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
            });
        });

        it('should not include data property when data is undefined', () => {
            const statusCode = StatusCodes.OK;
            const message = 'Success without data';

            sendSuccessResponse(mockResponse, statusCode, message);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
            });
        });

        it('should include data property when data is an empty object', () => {
            const statusCode = StatusCodes.OK;
            const message = 'Success with empty data';
            const data = {};

            sendSuccessResponse(mockResponse, statusCode, message, data);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
                data: data,
            });
        });

        it('should include data property when data is an empty array', () => {
            const statusCode = StatusCodes.OK;
            const message = 'Success with empty array';
            const data = [];

            sendSuccessResponse(mockResponse, statusCode, message, data);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: message,
                data: data,
            });
        });

        it('should handle different HTTP status codes', () => {
            const testCases = [StatusCodes.OK, StatusCodes.CREATED, StatusCodes.ACCEPTED, StatusCodes.NO_CONTENT];
            const message = 'Test message';

            testCases.forEach(statusCode => {
                const freshMockResponse = createMockResponse();
                sendSuccessResponse(freshMockResponse, statusCode, message);
                expect(freshMockResponse.status).toHaveBeenCalledWith(statusCode);
            });
        });
    });

    describe('sendErrorResponse', () => {
        it('should send an error response with message only', () => {
            const statusCode = StatusCodes.BAD_REQUEST;
            const message = 'Bad request';

            sendErrorResponse(mockResponse, statusCode, message);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {},
            });
        });

        it('should send an error response with message and code', () => {
            const statusCode = StatusCodes.NOT_FOUND;
            const message = 'Resource not found';
            const code = 'RESOURCE_NOT_FOUND';

            sendErrorResponse(mockResponse, statusCode, message, code);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {
                    code: code,
                },
            });
        });

        it('should send an error response with message, code, and details', () => {
            const statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
            const message = 'Validation failed';
            const code = 'VALIDATION_ERROR';
            const details = 'Email field is required';

            sendErrorResponse(mockResponse, statusCode, message, code, details);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {
                    code: code,
                    details: details,
                },
            });
        });

        it('should include stack trace in development environment', () => {
            process.env.NODE_ENV = 'development';

            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            const message = 'Internal server error';
            const code = 'INTERNAL_ERROR';
            const details = 'Database connection failed';
            const stackTrace = 'Error: Database connection failed\n    at line 1...';

            sendErrorResponse(mockResponse, statusCode, message, code, details, stackTrace);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {
                    code: code,
                    details: details,
                },
                stackTrace: stackTrace,
            });
        });

        it('should not include stack trace in production environment', () => {
            process.env.NODE_ENV = 'production';

            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            const message = 'Internal server error';
            const code = 'INTERNAL_ERROR';
            const details = 'Database connection failed';
            const stackTrace = 'Error: Database connection failed\n    at line 1...';

            sendErrorResponse(mockResponse, statusCode, message, code, details, stackTrace);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {
                    code: code,
                    details: details,
                },
            });

            // Ensure stackTrace is not included
            const callArgs = mockResponse.json.mock.calls[0][0];
            expect(callArgs).not.toHaveProperty('stackTrace');
        });

        it('should not include stack trace when NODE_ENV is not set', () => {
            delete process.env.NODE_ENV;

            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            const message = 'Internal server error';
            const stackTrace = 'Error: Stack trace here';

            sendErrorResponse(mockResponse, statusCode, message, null, null, stackTrace);

            const callArgs = mockResponse.json.mock.calls[0][0];
            expect(callArgs).not.toHaveProperty('stackTrace');
        });

        it('should handle null values for optional parameters', () => {
            const statusCode = StatusCodes.BAD_REQUEST;
            const message = 'Bad request';

            sendErrorResponse(mockResponse, statusCode, message, null, null, null);

            expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {},
            });
        });

        it('should handle different HTTP error status codes', () => {
            const testCases = [StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN, StatusCodes.NOT_FOUND, StatusCodes.UNPROCESSABLE_ENTITY, StatusCodes.INTERNAL_SERVER_ERROR, StatusCodes.BAD_GATEWAY, StatusCodes.SERVICE_UNAVAILABLE];
            const message = 'Test error message';

            testCases.forEach(statusCode => {
                const freshMockResponse = createMockResponse();
                sendErrorResponse(freshMockResponse, statusCode, message);
                expect(freshMockResponse.status).toHaveBeenCalledWith(statusCode);
            });
        });

        it('should only include error properties when they are provided', () => {
            // Test with only details (no code)
            const statusCode = StatusCodes.BAD_REQUEST;
            const message = 'Bad request';
            const details = 'Invalid input format';

            sendErrorResponse(mockResponse, statusCode, message, null, details);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {
                    details: details,
                },
            });
        });

        it('should handle empty string values for optional parameters', () => {
            const statusCode = StatusCodes.BAD_REQUEST;
            const message = 'Bad request';
            const code = '';
            const details = '';

            sendErrorResponse(mockResponse, statusCode, message, code, details);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: message,
                error: {},
            });
        });
    });

    describe('Integration tests', () => {
        it('should maintain consistent response structure between success and error responses', () => {
            // Send success response
            sendSuccessResponse(mockResponse, StatusCodes.OK, 'Success message', { data: 'test' });
            const successCall = mockResponse.json.mock.calls[0][0];

            // Reset mock
            mockResponse = createMockResponse();

            // Send error response
            sendErrorResponse(mockResponse, StatusCodes.BAD_REQUEST, 'Error message', 'ERROR_CODE');
            const errorCall = mockResponse.json.mock.calls[0][0];

            // Both should have success property
            expect(successCall).toHaveProperty('success', true);
            expect(errorCall).toHaveProperty('success', false);

            // Both should have message property
            expect(successCall).toHaveProperty('message');
            expect(errorCall).toHaveProperty('message');
        });

        it('should properly chain the status and json method calls', () => {
            sendSuccessResponse(mockResponse, StatusCodes.OK, 'Test');

            // Verify both methods were called
            expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Test'
            });

            // Verify status returns the response object for chaining
            expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        });
    });
});
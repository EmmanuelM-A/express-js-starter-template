/**
 * Tests for ApiError class.
 */

import { vi, describe, it, expect } from 'vitest';
import ApiError from '../../../src/errors/api-error.mjs';
import { StatusCodes } from 'http-status-codes';

describe('ApiError', () => {
    describe('constructor', () => {
        it('should create an ApiError with required parameters', () => {
            const message = 'Test error message';
            const status = StatusCodes.BAD_REQUEST;

            const error = new ApiError(message, status);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ApiError);
            expect(error.message).toBe(message);
            expect(error.status).toBe(status);
            expect(error.name).toBe('ApiError');
            expect(error.code).toBe('GENERIC_ERROR'); // default value
            expect(error.details).toBe(null); // default value
        });

        it('should create an ApiError with all parameters', () => {
            const message = 'Validation failed';
            const status = StatusCodes.UNPROCESSABLE_ENTITY;
            const code = 'VALIDATION_ERROR';
            const details = { field: 'email', reason: 'Invalid format' };

            const error = new ApiError(message, status, code, details);

            expect(error.message).toBe(message);
            expect(error.status).toBe(status);
            expect(error.code).toBe(code);
            expect(error.details).toBe(details);
            expect(error.name).toBe('ApiError');
        });

        it('should handle different HTTP status codes', () => {
            const testCases = [
                { status: StatusCodes.BAD_REQUEST, description: 'Bad Request' },
                { status: StatusCodes.UNAUTHORIZED, description: 'Unauthorized' },
                { status: StatusCodes.FORBIDDEN, description: 'Forbidden' },
                { status: StatusCodes.NOT_FOUND, description: 'Not Found' },
                { status: StatusCodes.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' }
            ];

            testCases.forEach(({ status, description }) => {
                const error = new ApiError(description, status);
                expect(error.status).toBe(status);
                expect(error.message).toBe(description);
            });
        });

        it('should handle null details parameter', () => {
            const error = new ApiError('Test message', StatusCodes.BAD_REQUEST, 'TEST_ERROR', null);

            expect(error.details).toBe(null);
        });

        it('should handle complex details objects', () => {
            const details = {
                validationErrors: [
                    { field: 'email', message: 'Required' },
                    { field: 'password', message: 'Too short' }
                ],
                timestamp: new Date().toISOString()
            };

            const error = new ApiError('Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);

            expect(error.details).toEqual(details);
            expect(error.details.validationErrors).toHaveLength(2);
        });
    });

    describe('inheritance and properties', () => {
        it('should properly inherit from Error class', () => {
            const error = new ApiError('Test error', StatusCodes.INTERNAL_SERVER_ERROR);

            expect(error instanceof Error).toBe(true);
            expect(error instanceof ApiError).toBe(true);
            expect(Object.getPrototypeOf(error.constructor)).toBe(Error);
        });

        it('should have a stack trace', () => {
            const error = new ApiError('Test error', StatusCodes.INTERNAL_SERVER_ERROR);

            expect(error.stack).toBeDefined();
            expect(typeof error.stack).toBe('string');
            expect(error.stack).toContain('ApiError');
        });

        it('should have correct name property', () => {
            const error = new ApiError('Test error', StatusCodes.INTERNAL_SERVER_ERROR);

            expect(error.name).toBe('ApiError');
        });

        /*it('should be serializable to JSON', () => {
            const error = new ApiError('Test error', StatusCodes.BAD_REQUEST, 'TEST_ERROR', { extra: 'info' });

            // Convert to JSON and back
            const serialized = JSON.stringify(error);
            const parsed = JSON.parse(serialized);

            // If you wish to fix this you must implement the solution shown here:
            // https://blog.zjffun.com/json-stringify-error-object-replacer

            // Note: stack trace and name might not serialize by default
            expect(parsed.message).toBe(error.message);
            expect(parsed.status).toBe(error.status);
            expect(parsed.code).toBe(error.code);
            expect(parsed.details).toEqual(error.details);
        });*/
    });

    describe('error handling scenarios', () => {
        it('should work with try-catch blocks', () => {
            expect(() => {
                try {
                    throw new ApiError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR, 'SERVER_ERROR');
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiError);
                    expect(error.message).toBe('Something went wrong');
                    expect(error.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
                    expect(error.code).toBe('SERVER_ERROR');
                    throw error; // Re-throw to test the expect().toThrow()
                }
            }).toThrow(ApiError);
        });

        it('should maintain error properties when caught', () => {
            let caughtError;

            try {
                throw new ApiError('Database error', StatusCodes.SERVICE_UNAVAILABLE, 'DB_CONNECTION_ERROR', {
                    database: 'users',
                    timeout: 5000
                });
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).toBeInstanceOf(ApiError);
            expect(caughtError.status).toBe(StatusCodes.SERVICE_UNAVAILABLE);
            expect(caughtError.code).toBe('DB_CONNECTION_ERROR');
            expect(caughtError.details.database).toBe('users');
        });
    });

    describe('edge cases', () => {
        it('should handle empty string message', () => {
            const error = new ApiError('', StatusCodes.BAD_REQUEST);

            expect(error.message).toBe('');
            expect(error.status).toBe(StatusCodes.BAD_REQUEST);
        });

        it('should handle zero status code', () => {
            const error = new ApiError('Test', 0);

            expect(error.status).toBe(0);
        });

        it('should handle empty string code', () => {
            const error = new ApiError('Test', StatusCodes.BAD_REQUEST, '');

            expect(error.code).toBe('');
        });

        it('should handle undefined details', () => {
            const error = new ApiError('Test', StatusCodes.BAD_REQUEST, 'TEST_ERROR', null);

            expect(error.details).toBe(null);
        });
    });

    describe('common use cases', () => {
        it('should create a validation error', () => {
            const error = new ApiError(
                'Validation failed',
                StatusCodes.UNPROCESSABLE_ENTITY,
                'VALIDATION_ERROR',
                {
                    fields: ['email', 'password'],
                    errors: {
                        email: 'Invalid email format',
                        password: 'Password too short'
                    }
                }
            );

            expect(error.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.details.fields).toContain('email');
        });

        it('should create an authentication error', () => {
            const error = new ApiError(
                'Invalid credentials',
                StatusCodes.UNAUTHORIZED,
                'AUTH_FAILED'
            );

            expect(error.status).toBe(StatusCodes.UNAUTHORIZED);
            expect(error.code).toBe('AUTH_FAILED');
            expect(error.details).toBe(null);
        });

        it('should create a not found error', () => {
            const error = new ApiError(
                'User not found',
                StatusCodes.NOT_FOUND,
                'USER_NOT_FOUND',
                { userId: '12345' }
            );

            expect(error.status).toBe(StatusCodes.NOT_FOUND);
            expect(error.code).toBe('USER_NOT_FOUND');
            expect(error.details.userId).toBe('12345');
        });

        it('should create a server error', () => {
            const error = new ApiError(
                'Internal server error',
                StatusCodes.INTERNAL_SERVER_ERROR,
                'INTERNAL_ERROR',
                { service: 'database', operation: 'findUser' }
            );

            expect(error.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(error.code).toBe('INTERNAL_ERROR');
            expect(error.details.service).toBe('database');
        });
    });
});
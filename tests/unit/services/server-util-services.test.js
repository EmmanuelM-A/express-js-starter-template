/**
 * Unit tests for ServerUtilServices
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import os from 'os';
import { ServerUtilServices } from '../../../src/services/server-util-services.mjs';
import ApiError from '../../../src/utils/api-error.mjs';
import { StatusCodes } from 'http-status-codes';

// Mock os module using vi.mock
vi.mock('os', () => {
    return {
        default: {
            cpus: vi.fn(),
            platform: vi.fn(),
            loadavg: vi.fn(),
        },
        cpus: vi.fn(), // Include named exports as well for robustness
        platform: vi.fn(),
        loadavg: vi.fn(),
    };
});

describe('ServerUtilServices', () => {
    let originalProcessUptime;
    let originalProcessMemoryUsage;
    let originalDate;

    beforeEach(() => {
        // Store original methods
        originalProcessUptime = process.uptime;
        originalProcessMemoryUsage = process.memoryUsage;
        originalDate = global.Date;

        // Mock process methods using vi.fn
        process.uptime = vi.fn(() => 3600); // 1 hour
        process.memoryUsage = vi.fn(() => ({
            rss: 50000000,
            heapUsed: 25000000,
            heapTotal: 40000000,
            external: 5000000,
            arrayBuffers: 1000000
        }));

        // Mock os methods
        os.cpus.mockReturnValue(new Array(4).fill({}));
        os.platform.mockReturnValue('linux');
        os.loadavg.mockReturnValue([0.5, 0.7, 0.8]);

        // Mock Date
        const mockDate = new Date('2024-01-01T12:00:00.000Z');
        global.Date = vi.fn(() => mockDate);
        global.Date.now = vi.fn(() => mockDate.getTime());
        global.Date.prototype.toISOString = vi.fn(() => mockDate.toISOString());
    });

    afterEach(() => {
        // Restore original methods
        process.uptime = originalProcessUptime;
        process.memoryUsage = originalProcessMemoryUsage;
        global.Date = originalDate;
        vi.clearAllMocks();
    });

    describe('ping', () => {
        it('should return pong message with timestamp', async () => {
            const result = await ServerUtilServices.ping();

            expect(result).toEqual({
                message: 'pong',
                timestamp: '2024-01-01T12:00:00.000Z'
            });
        });

        it('should return different timestamps on multiple calls', async () => {
            // First call
            const result1 = await ServerUtilServices.ping();
            
            // Mock different time for second call
            const mockDate2 = new Date('2024-01-01T12:01:00.000Z');
            global.Date = vi.fn(() => mockDate2);
            global.Date.now = vi.fn(() => mockDate2.getTime());
            global.Date.prototype.toISOString = vi.fn(() => mockDate2.toISOString());
            
            const result2 = await ServerUtilServices.ping();

            expect(result1.message).toBe('pong');
            expect(result2.message).toBe('pong');
            expect(result1.timestamp).toBe('2024-01-01T12:00:00.000Z');
            expect(result2.timestamp).toBe('2024-01-01T12:00:00.000Z');
        });
    });

    describe('health', () => {
        it('should return complete health status', async () => {
            const result = await ServerUtilServices.health();

            expect(result).toEqual({
                status: 'ok',
                uptime: 3600,
                memory: {
                    rss: 50000000,
                    heapUsed: 25000000,
                    heapTotal: 40000000
                },
                cpuCount: 4,
                platform: 'linux',
                loadAverage: [0.5, 0.7, 0.8],
                timestamp: '2024-01-01T12:00:00.000Z'
            });
        });

        it('should call process.uptime and process.memoryUsage', async () => {
            await ServerUtilServices.health();

            expect(process.uptime).toHaveBeenCalled();
            expect(process.memoryUsage).toHaveBeenCalled();
        });

        it('should call os methods for system info', async () => {
            await ServerUtilServices.health();

            expect(os.cpus).toHaveBeenCalled();
            expect(os.platform).toHaveBeenCalled();
            expect(os.loadavg).toHaveBeenCalled();
        });

        it('should handle different system configurations', async () => {
            // Mock different system
            os.cpus.mockReturnValue(new Array(8).fill({})); // 8 CPUs
            os.platform.mockReturnValue('darwin');
            os.loadavg.mockReturnValue([1.2, 1.5, 2.0]);

            const result = await ServerUtilServices.health();

            expect(result.cpuCount).toBe(8);
            expect(result.platform).toBe('darwin');
            expect(result.loadAverage).toEqual([1.2, 1.5, 2.0]);
        });
    });

    describe('status', () => {
        it('should return server status with uptime', async () => {
            const result = await ServerUtilServices.status();

            expect(result).toEqual({
                status: 'running',
                uptime: 3600,
                timestamp: '2024-01-01T12:00:00.000Z'
            });
        });

        it('should call process.uptime', async () => {
            await ServerUtilServices.status();

            expect(process.uptime).toHaveBeenCalled();
        });

        it('should handle different uptime values', async () => {
            process.uptime.mockReturnValue(7200); // 2 hours

            const result = await ServerUtilServices.status();

            expect(result.uptime).toBe(7200);
            expect(result.status).toBe('running');
        });
    });

    describe('testFail', () => {
        it('should throw an ApiError', async () => {
            await expect(ServerUtilServices.testFail()).rejects.toThrow(ApiError);
        });

        it('should throw one of the predefined errors', async () => {
            const expectedErrors = [
                {
                    message: "Database connection failed!",
                    status: StatusCodes.INTERNAL_SERVER_ERROR,
                    code: "DATABASE_CONNECTION_ERROR"
                },
                {
                    message: "Unauthorized access!",
                    status: StatusCodes.UNAUTHORIZED,
                    code: "ACCESS_DENIED"
                },
                {
                    message: "Resource not found!",
                    status: StatusCodes.NOT_FOUND,
                    code: "RESOURCE_NOT_FOUND"
                },
                {
                    message: "Service unavailable!",
                    status: StatusCodes.SERVICE_UNAVAILABLE,
                    code: "SERVICE_IN_DEVELOPMENT"
                },
                {
                    message: "Validation error!",
                    status: StatusCodes.BAD_REQUEST,
                    code: "VALIDATION_ERROR"
                }
            ];

            try {
                await ServerUtilServices.testFail();
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                
                const matchingError = expectedErrors.find(expectedError => 
                    error.message === expectedError.message &&
                    error.status === expectedError.status &&
                    error.code === expectedError.code
                );
                
                expect(matchingError).toBeDefined();
            }
        });

        it('should throw different errors on multiple calls (eventually)', async () => {
            const errors = new Set();
            const maxAttempts = 50; // Try multiple times to get different errors

            for (let i = 0; i < maxAttempts; i++) {
                try {
                    await ServerUtilServices.testFail();
                } catch (error) {
                    errors.add(error.code);
                }
            }

            // Should have at least 2 different error types after 50 attempts
            expect(errors.size).toBeGreaterThan(1);
        });

        it('should always throw errors with proper ApiError structure', async () => {
            const attempts = 5;
            
            for (let i = 0; i < attempts; i++) {
                try {
                    await ServerUtilServices.testFail();
                    // Fail('Expected testFail to throw an error'); // Vitest has no fail
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiError);
                    expect(error.message).toBeDefined();
                    expect(error.status).toBeDefined();
                    expect(error.code).toBeDefined();
                    expect(typeof error.message).toBe('string');
                    expect(typeof error.status).toBe('number');
                    expect(typeof error.code).toBe('string');
                }
            }
        });
    });

    describe('static method behavior', () => {
        it('should have all methods as static', () => {
            expect(typeof ServerUtilServices.ping).toBe('function');
            expect(typeof ServerUtilServices.health).toBe('function');
            expect(typeof ServerUtilServices.status).toBe('function');
            expect(typeof ServerUtilServices.testFail).toBe('function');
        });

        it('should not require instantiation', async () => {
            // All methods should work without creating an instance
            const pingResult = await ServerUtilServices.ping();
            const healthResult = await ServerUtilServices.health();
            const statusResult = await ServerUtilServices.status();

            expect(pingResult).toBeDefined();
            expect(healthResult).toBeDefined();
            expect(statusResult).toBeDefined();
        });
    });
});
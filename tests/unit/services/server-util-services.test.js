/**
 * Unit tests for ServerUtilServices
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import os from 'os';
import ServerUtilServices from '../../../src/services/server-util-services.mjs';
import ApiError from '../../../src/errors/api-error.mjs';
import { COMMON_ERRORS } from '../../../src/errors/common-errors.mjs';

// Mock os module using vi.mock
vi.mock('os', () => {
    return {
        default: {
            cpus: vi.fn(),
            platform: vi.fn(),
            loadavg: vi.fn(),
        },
        cpus: vi.fn(),
        platform: vi.fn(),
        loadavg: vi.fn(),
    };
});

describe('ServerUtilServices', () => {
    let serverUtilServices;
    let originalProcessUptime;
    let originalProcessMemoryUsage;

    beforeEach(() => {
        // Create new instance for each test
        serverUtilServices = new ServerUtilServices();

        // Store original methods
        originalProcessUptime = process.uptime;
        originalProcessMemoryUsage = process.memoryUsage;

        // Mock process methods
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
    });

    afterEach(() => {
        // Restore original methods
        process.uptime = originalProcessUptime;
        process.memoryUsage = originalProcessMemoryUsage;
        vi.clearAllMocks();
    });

    describe('ping', () => {
        it('should return pong message', () => {
            const result = serverUtilServices.ping();

            expect(result).toEqual({
                message: 'pong'
            });
        });

        it('should return consistent response on multiple calls', () => {
            const result1 = serverUtilServices.ping();
            const result2 = serverUtilServices.ping();

            expect(result1).toEqual(result2);
            expect(result1.message).toBe('pong');
        });
    });

    describe('health', () => {
        it('should return complete health status', () => {
            const result = serverUtilServices.health();

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
                loadAverage: [0.5, 0.7, 0.8]
            });
        });

        it('should call process.uptime and process.memoryUsage', () => {
            serverUtilServices.health();

            expect(process.uptime).toHaveBeenCalled();
            expect(process.memoryUsage).toHaveBeenCalled();
        });

        it('should call os methods for system info', () => {
            serverUtilServices.health();

            expect(os.cpus).toHaveBeenCalled();
            expect(os.platform).toHaveBeenCalled();
            expect(os.loadavg).toHaveBeenCalled();
        });

        it('should handle different system configurations', () => {
            // Mock different system
            os.cpus.mockReturnValue(new Array(8).fill({})); // 8 CPUs
            os.platform.mockReturnValue('darwin');
            os.loadavg.mockReturnValue([1.2, 1.5, 2.0]);

            const result = serverUtilServices.health();

            expect(result.cpuCount).toBe(8);
            expect(result.platform).toBe('darwin');
            expect(result.loadAverage).toEqual([1.2, 1.5, 2.0]);
        });

        it('should return memory values as numbers', () => {
            const result = serverUtilServices.health();

            expect(typeof result.memory.rss).toBe('number');
            expect(typeof result.memory.heapUsed).toBe('number');
            expect(typeof result.memory.heapTotal).toBe('number');
        });
    });

    describe('testFail', () => {
        it('should throw an ApiError', () => {
            expect(() => serverUtilServices.testFail()).toThrow(ApiError);
        });

        it('should throw an error with valid status code from COMMON_ERRORS', () => {
            const validStatusCodes = Object.keys(COMMON_ERRORS).map(Number);

            try {
                serverUtilServices.testFail();
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(validStatusCodes).toContain(error.status);
            }
        });

        it('should throw error with matching message, code, and details from COMMON_ERRORS', () => {
            try {
                serverUtilServices.testFail();
            } catch (error) {
                const errorConfig = COMMON_ERRORS[error.status];

                expect(error.message).toBe(errorConfig.message);
                expect(error.code).toBe(errorConfig.code);
                expect(error.details).toBe(errorConfig.details);
            }
        });

        it('should throw different errors on multiple calls (eventually)', () => {
            const errorCodes = new Set();
            const maxAttempts = 50;

            for (let i = 0; i < maxAttempts; i++) {
                try {
                    serverUtilServices.testFail();
                } catch (error) {
                    errorCodes.add(error.code);
                }
            }

            // Should have at least 2 different error types after 50 attempts
            expect(errorCodes.size).toBeGreaterThan(1);
        });

        it('should always throw errors with proper ApiError structure', () => {
            const attempts = 10;

            for (let i = 0; i < attempts; i++) {
                try {
                    serverUtilServices.testFail();
                } catch (error) {
                    expect(error).toBeInstanceOf(ApiError);
                    expect(error.message).toBeDefined();
                    expect(error.status).toBeDefined();
                    expect(error.code).toBeDefined();
                    expect(error.details).toBeDefined();
                    expect(typeof error.message).toBe('string');
                    expect(typeof error.status).toBe('number');
                    expect(typeof error.code).toBe('string');
                }
            }
        });

        it('should throw error with status code as number', () => {
            try {
                serverUtilServices.testFail();
            } catch (error) {
                expect(typeof error.status).toBe('number');
                expect(error.status).toBeGreaterThan(0);
            }
        });
    });

    describe('instance behavior', () => {
        it('should be instantiable', () => {
            const instance = new ServerUtilServices();
            expect(instance).toBeInstanceOf(ServerUtilServices);
        });

        it('should have all required methods', () => {
            expect(typeof serverUtilServices.ping).toBe('function');
            expect(typeof serverUtilServices.health).toBe('function');
            expect(typeof serverUtilServices.testFail).toBe('function');
        });

        it('should work with multiple instances independently', () => {
            const instance1 = new ServerUtilServices();
            const instance2 = new ServerUtilServices();

            const result1 = instance1.ping();
            const result2 = instance2.ping();

            expect(result1).toEqual(result2);
            expect(result1.message).toBe('pong');
        });
    });
});
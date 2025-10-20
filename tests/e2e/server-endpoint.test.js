/**
 * End-to-End tests for Server Endpoints
 * Tests the actual server endpoints without mocking
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import serverController, { ServerController } from '../../src/api/v1/controllers/server-controller.mjs';
import {errorHandler, setupErrorHandlers} from '../../src/middleware/error-handler.mjs';
import {setupSecurity} from "../../src/middleware/security-configurations.mjs";
import {COMMON_ERRORS} from "../../src/errors/common-errors.mjs";


describe('Server Endpoints E2E Tests', () => {
    let app;
    let server;

    beforeAll(async () => {
        // Create Express app with actual configuration
        app = express();
        app.use(express.json());

        setupSecurity(app);

        // Set up routes exactly as they would be in production
        app.get('/api/v1/server/ping', serverController.sendPing);
        app.get('/api/v1/server/health', serverController.getHealthData);
        app.get('/api/v1/server/test-fail', serverController.testErrorHandler);

        // Add error handling middleware
        setupErrorHandlers(app);

        // Start server on a random port
        await new Promise(resolve => {
            server = app.listen(0, () => {
                resolve();
            });
        });
    });

    afterAll(async () => {
        if (server) {
            await new Promise(resolve => server.close(resolve));
        }
    });

    describe('GET /api/v1/server/ping', () => {
        it('should return pong with timestamp', async () => {
            const response = await request(app)
                .get('/api/v1/server/ping')
                .expect(StatusCodes.OK);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Ping sent to the server successfully!');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('message', 'pong');
        });

        it('should have correct response headers', async () => {
            const response = await request(app)
                .get('/api/v1/server/ping')
                .expect(StatusCodes.OK);

            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
    });

    describe('GET /api/v1/server/health', () => {
        it('should return comprehensive health information', async () => {
            const response = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Health check returned successfully!');
            expect(response.body).toHaveProperty('data');

            const healthData = response.body.data;
            
            // Check required health properties
            expect(healthData).toHaveProperty('status', 'ok');
            expect(healthData).toHaveProperty('uptime');
            expect(healthData).toHaveProperty('memory');
            expect(healthData).toHaveProperty('cpuCount');
            expect(healthData).toHaveProperty('platform');
            expect(healthData).toHaveProperty('loadAverage');

            // Validate data types and reasonable values
            expect(typeof healthData.uptime).toBe('number');
            expect(healthData.uptime).toBeGreaterThan(0);

            // Validate memory object
            expect(healthData.memory).toHaveProperty('rss');
            expect(healthData.memory).toHaveProperty('heapUsed');
            expect(healthData.memory).toHaveProperty('heapTotal');
            expect(typeof healthData.memory.rss).toBe('number');
            expect(typeof healthData.memory.heapUsed).toBe('number');
            expect(typeof healthData.memory.heapTotal).toBe('number');

            // Validate system info
            expect(typeof healthData.cpuCount).toBe('number');
            expect(healthData.cpuCount).toBeGreaterThan(0);
            expect(typeof healthData.platform).toBe('string');
            expect(healthData.platform.length).toBeGreaterThan(0);
            expect(Array.isArray(healthData.loadAverage)).toBe(true);
            expect(healthData.loadAverage).toHaveLength(3);
        });

        it('should return realistic memory usage values', async () => {
            const response = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            const memory = response.body.data.memory;
            
            // Memory values should be positive and realistic
            expect(memory.rss).toBeGreaterThan(1000000); // At least 1MB
            expect(memory.heapUsed).toBeGreaterThan(0);
            expect(memory.heapTotal).toBeGreaterThan(memory.heapUsed);
            expect(memory.rss).toBeGreaterThan(memory.heapTotal);
        });

        it('should return consistent platform information', async () => {
            const response1 = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            const response2 = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            // Platform and CPU count should be consistent
            expect(response1.body.data.platform).toBe(response2.body.data.platform);
            expect(response1.body.data.cpuCount).toBe(response2.body.data.cpuCount);
        });

        it('should show increasing uptime on subsequent calls', async () => {
            const response1 = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 100));

            const response2 = await request(app)
                .get('/api/v1/server/health')
                .expect(StatusCodes.OK);

            expect(response2.body.data.uptime).toBeGreaterThanOrEqual(response1.body.data.uptime);
        });
    });

    describe('GET /api/v1/server/test-fail', () => {
        it('should return an error response', async () => {
            const response = await request(app).get("/api/v1/server/test-fail");

            const keys = Object.keys(COMMON_ERRORS).map(Number);

            expect(keys).toContain(response.status);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('code');
            expect(response.body.error).toHaveProperty('details');

            expect(COMMON_ERRORS[response.status]).toBeDefined();
        });

        it('should return different errors on multiple calls (eventually)', async () => {
            const errors = new Set();
            const maxAttempts = 20;

            for (let i = 0; i < maxAttempts; i++) {
                const response = await request(app).get('/api/v1/server/test-fail');
                
                errors.add(response.body.error.code);
                
                // If we get multiple different errors, we can break early
                if (errors.size > 1) break;
            }

            // Should eventually get different error types
            expect(errors.size).toBeGreaterThan(1);
        });

        it('should handle errors consistently across requests', async () => {
            const promises = Array(5).fill(null).map(() => 
                request(app).get('/api/v1/server/test-fail')
            );

            const responses = await Promise.all(promises);

            responses.forEach(response => {
                expect(response.body).toHaveProperty('success', false);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toHaveProperty('code');
                expect(response.body.error).toHaveProperty('details');
                expect(typeof response.body.message).toBe('string');
                expect(typeof response.body.error.code).toBe('string');
            });
        });
    });

    describe('Error handling integration', () => {
        it('should handle 404 for non-existent endpoints', async () => {
            const response = await request(app)
                .get('/api/v1/server/non-existent')
                .expect(StatusCodes.NOT_FOUND);

            // Express default 404 handling - no custom error structure expected
            expect(response.text).toContain('Cannot GET /api/v1/server/non-existent');
        });

        it('should handle invalid HTTP methods', async () => {
            const response = await request(app)
                .post('/api/v1/server/ping')
                .expect(StatusCodes.NOT_FOUND);

            expect(response.text).toContain('Cannot POST /api/v1/server/ping');
        });
    });

    describe('Response consistency', () => {
        it('should have consistent success response structure', async () => {
            const endpoints = [
                '/api/v1/server/ping',
                '/api/v1/server/health',
            ];

            for (const endpoint of endpoints) {
                const response = await request(app)
                    .get(endpoint)
                    .expect(StatusCodes.OK);

                expect(response.body).toHaveProperty('success', true);
                expect(response.body).toHaveProperty('message');
                expect(response.body).toHaveProperty('data');
                expect(typeof response.body.message).toBe('string');
                expect(typeof response.body.data).toBe('object');
            }
        });

        it('should return proper content-type headers', async () => {
            const endpoints = [
                '/api/v1/server/ping',
                '/api/v1/server/health',
                '/api/v1/server/test-fail'
            ];

            for (const endpoint of endpoints) {
                const response = await request(app).get(endpoint);
                expect(response.headers['content-type']).toMatch(/application\/json/);
            }
        });
    });

    describe('Performance and timing', () => {
        it('should respond to ping requests quickly', async () => {
            const startTime = Date.now();
            
            await request(app)
                .get('/api/v1/server/ping')
                .expect(StatusCodes.OK);
        
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // Should respond within 100ms
            expect(responseTime).toBeLessThan(100);
        });

        it('should handle concurrent requests', async () => {
            const concurrentRequests = Array(10).fill(null).map(() => 
                request(app).get('/api/v1/server/ping')
            );

            const responses = await Promise.all(concurrentRequests);

            responses.forEach(response => {
                expect(response.status).toBe(StatusCodes.OK);
                expect(response.body.success).toBe(true);
            });
        });
    });
});
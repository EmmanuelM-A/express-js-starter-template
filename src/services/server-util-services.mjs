import os from "os";
import ApiError from "../errors/api-error.mjs";
import {StatusCodes} from "http-status-codes";

/**
 * The service class for the server status checks.
 * Provides utilities like ping and health diagnostics.
 */
export class ServerUtilServices {
    /**
     * Responds to ping requests to verify server is running.
     * 
     * @returns An object with a basic message and timestamp.
     */
    static async ping() {
        return {
            message: "pong",
            timestamp: new Date().toISOString()
        }
    }

    /**
     * Returns basic health status including uptime and memory usage.
     * 
     * @returns Health check data.
     */
    static async health() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            memory: {
                rss: process.memoryUsage().rss,
                heapUsed: process.memoryUsage().heapUsed,
                heapTotal: process.memoryUsage().heapTotal,
            },
            cpuCount: os.cpus().length,
            platform: os.platform(),
            loadAverage: os.loadavg()
        };
    }

    /**
     * Returns the server uptime and status.
     * 
     * @returns An object containing the server status.
     */
    static async status() {
        return {
            status: 'running',
            uptime: process.uptime()
        };
    }

    /**
     * Returns a random error. Primarily used to test error handling capabilities.
     * 
     * @throws {ApiError} Throws a randomly selected error.
     */
    static async testFail() {
        const errors = [
            new ApiError(
                "Database connection failed!",
                StatusCodes.INTERNAL_SERVER_ERROR,
                "DATABASE_CONNECTION_ERROR"
            ),
            new ApiError(
                "Unauthorized access!",
                StatusCodes.UNAUTHORIZED,
                "ACCESS_DENIED"
            ),
            new ApiError(
                "Resource not found!",
                StatusCodes.NOT_FOUND,
                "RESOURCE_NOT_FOUND"
            ),
            new ApiError(
                "Service unavailable!",
                StatusCodes.SERVICE_UNAVAILABLE,
                "SERVICE_IN_DEVELOPMENT"
            ),
            new ApiError(
                "Validation error!",
                StatusCodes.BAD_REQUEST,
                "VALIDATION_ERROR"
            )
        ];

        throw errors[Math.floor(Math.random() * errors.length)];
    }
}
import os from "os";
import ApiError from "../errors/api-error.mjs";
import {COMMON_ERRORS} from "../errors/common-errors.mjs";

/**
 * The service class for the server status checks.
 * Provides utilities like ping and health diagnostics.
 */
export default class ServerUtilServices {
    /**
     * Responds to ping requests to verify server is running.
     * 
     * @returns An object with a basic message and timestamp.
     */
    ping() {
        return {
            message: "pong",
        }
    }

    /**
     * Returns basic health status including uptime and memory usage.
     * 
     * @returns Health check data.
     */
    health() {
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
     * Returns a random error. Primarily used to test error handling capabilities.
     * 
     * @throws {ApiError} Throws a randomly selected error.
     */
    testFail() {
        const keys = Object.keys(COMMON_ERRORS);
        const statusCode = Number(keys[Math.floor(Math.random() * keys.length)]);

        throw new ApiError(
            COMMON_ERRORS[statusCode].message,
            statusCode,
            COMMON_ERRORS[statusCode].code,
            COMMON_ERRORS[statusCode].details
        );
    }
}
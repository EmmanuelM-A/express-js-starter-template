import os from "os";

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
            loadAverage: os.loadavg(),
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Returns the server uptime and status.
     * 
     * @returns An object containg the server status.
     */
    static async status() {
        return {
            status: 'running',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
}
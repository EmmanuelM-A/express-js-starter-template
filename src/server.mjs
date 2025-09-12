/**
 * Entry point to run the application.
 */

import app from "./app.mjs";
import logger from './logger/winston-logger.mjs';
import { setupSwaggerDocs } from './docs/swagger.mjs';
import { settings } from "./config/settings.mjs";

const PORT = settings.server.PORT;


/**
 * Starts the server.
 */
async function startServer() {
    try {
        // SETUP CONNECTIONS TO EXTERNAL SERVICES HERE

        // Mount Swagger at /api-docs
        await setupSwaggerDocs(app);

        // Start the Express server
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

await startServer();


/**
 * This ensures that when the server is stopped (e.g., by Ctrl+C or a SIGTERM 
 * signal from Docker), it gracefully closes connections to any external
 * service.
 */

process.on('SIGINT', async () => {
    logger.info('SIGINT signal received. Shutting down gracefully...');
    await shutdown();
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received. Shutting down gracefully...');
    await shutdown();
});

async function shutdown() {
    try {
        // CLOSE CONNECTIONS TO ANY EXTERNAL SERVICES HERE
        logger.info('Application shut down.');
        process.exit(0);
    } catch (err) {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
}

import dotenv from "dotenv";

dotenv.config();

import app from "./app.mjs";
import logger from './logger/winston-logger.mjs';
import { setupSwaggerDocs } from './docs/swagger.mjs';

const PORT = process.env.PORT || 5000;

//
// --------------------- Application Startup Logic ---------------------
//

async function startServer() {
    try {
        // SETUP CONENCTIONS TO EXTERNAL SERVICES HERE

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

startServer();

//
// --------------------- Graceful Shutdown ---------------------
//

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
        // CLOSE CONENCTIONS TO ANY EXTERNAL SERVICES HERE
        logger.info('Application shut down.');
        process.exit(0);
    } catch (err) {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
}

import expressAsyncHandler from "express-async-handler";
import ServerUtilServices from "../../../services/server-util-services.mjs";
import { sendSuccessResponse } from "../../../utils/response-delivery.mjs";
import { StatusCodes } from "http-status-codes";
import logger from "../../../logger/winston-logger.mjs";

/**
 * Handles server check endpoint requests.
 */
export class ServerController {
    constructor() {
        this.serverUtilServices = new ServerUtilServices();
    }

    /**
     * Pings the server.
    */
    sendPing = expressAsyncHandler(async (request, response) => {
        const pong = this.serverUtilServices.ping();

        sendSuccessResponse(
            response,
            StatusCodes.OK,
            "Ping sent to the server successfully!",
            pong
        );

        logger.debug("Ping sent!");
    });

    /**
     * Gets health check data.
     */
    getHealthData = expressAsyncHandler(async (request, response) => {
        const healthCheckData = this.serverUtilServices.health();

        sendSuccessResponse(
            response,
            StatusCodes.OK,
            "Health check returned successfully!",
            healthCheckData
        );

        logger.debug("Health check data sent!");
    });

    /**
     * Throws an error on request to test error handling.
     */
    testErrorHandler = expressAsyncHandler(async (request, response) => {
        
        this.serverUtilServices.testFail();
        
        logger.error("You should not see this message!");
    });
}

/**
 * Pre-configured ServerController instance ready for use in routes.
 * @type {ServerController}
 */
const serverController = new ServerController();

export default serverController;
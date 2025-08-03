import expressAsyncHandler from "express-async-handler";
import { ServerUtilServices } from "../../../services/server-util-services.mjs";
import { sendSuccessResponse } from "../../../utils/response-structure.mjs";
import { StatusCodes } from "http-status-codes";
import logger from "../../../logger/winston-logger.mjs";

/**
 * Handles server checks endpoint requests.
 */
export class ServerController {
    /**
     * Pings the server.
    */
    static ping = expressAsyncHandler(async (request, response) => {
        const pingData = await ServerUtilServices.ping();

        sendSuccessResponse(
            response,
            StatusCodes.OK,
            "Ping sent to the server successfully!",
            pingData
        );

        logger.debug("Ping sent!");
    });

    /**
     * Gets health check data.
     */
    static health = expressAsyncHandler(async (request, response) => {
        const healthCheckData = await ServerUtilServices.health();

        sendSuccessResponse(
            response,
            StatusCodes.OK,
            "Health check returned successfully!",
            healthCheckData
        );

        logger.debug("Health check data sent!");
    });

    /**
     * Gets the current status of the server.
     */
    static status = expressAsyncHandler(async (request, response) => {
        const serverStatusData = await ServerUtilServices.status();

        sendSuccessResponse(
            response,
            StatusCodes.OK,
            "Server status returned successfully!",
            serverStatusData
        );

        logger.debug("Status info sent!");
    });

    /**
     * Thows an error on request to test error handling.
     */

    static testFail = expressAsyncHandler(async (request, response) => {
        
        await ServerUtilServices.testFail();
        
        logger.debug("You should not see this message!");
    });
}

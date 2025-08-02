import expressAsyncHandler from "express-async-handler";
import { ServerUtilServices } from "../../services/server-util-services.mjs";
import { sendSuccessResponse } from "../../utils/response-structure.mjs";
import { StatusCodes } from "http-status-codes";

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
    });
}

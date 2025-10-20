import express from "express";
import serverController, { ServerController } from "../controllers/server-controller.mjs";

const serverRouter = express.Router();


serverRouter.get("/ping", serverController.sendPing);
serverRouter.get("/health", serverController.getHealthData);
serverRouter.get("/test-fail", serverController.testErrorHandler);

export default serverRouter;
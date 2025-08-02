import express from "express";
import { ServerController } from "./server-controller.mjs";

const serverRouter = express.Router();


serverRouter.get("/ping", ServerController.ping);
serverRouter.get("/health", ServerController.health);
serverRouter.get("/status", ServerController.status);
serverRouter.get("/test-fail", ServerController.testFail);

export default serverRouter;
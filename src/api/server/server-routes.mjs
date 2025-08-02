import express from "express";
import { ServerController } from "./server-controller.mjs";

const serverRouter = express.Router();


serverRouter.get("/ping", ServerController.ping);
serverRouter.get("/health", ServerController.health);
serverRouter.get("/status", ServerController.status);

export default serverRouter;
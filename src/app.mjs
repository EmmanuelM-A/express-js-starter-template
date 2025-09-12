import express from "express";
import {setupErrorHandlers} from "./middleware/api-error-handler.mjs";
import cookieParser from "cookie-parser";
import { limiter } from "./middleware/api-rate-limiter.mjs";
import helmet from "helmet";
import cors from "cors";
import serverRouter from "./api/v1/routes/server-routes.mjs";

const app = express();

// Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);
app.use("/api/v1", limiter);

// Route setup
app.use("/api/v1/server", serverRouter);

setupErrorHandlers(app);

export default app;

import express from "express";
import {setupErrorHandlers} from "./middleware/error-handler.mjs";
import {globalLimiter} from "./middleware/api-rate-limiter.mjs";
import serverRouter from "./api/v1/routes/server-routes.mjs";
import {setupSecurity} from "./middleware/security-configurations.mjs";

const app = express();

app.use(express.json());

setupSecurity(app);

app.use("/api/v1", globalLimiter);

// Route setup
app.use("/api/v1/server", serverRouter);

setupErrorHandlers(app);

export default app;

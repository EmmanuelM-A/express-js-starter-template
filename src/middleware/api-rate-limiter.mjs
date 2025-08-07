import { rateLimit } from 'express-rate-limit';

/**
 * Applied to all routes and prevents server exploitation.
 */
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});


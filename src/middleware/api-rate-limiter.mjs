import { rateLimit } from 'express-rate-limit';

// TODO: CREATE TESTS FOR RATE-LIMITERS

/**
 * Factory function to create a new rate limiter with sensible defaults.
 *
 * @param {Object} options - Custom options to override defaults
 * @param {number} [options.windowMs=900000] - Duration of the time window in ms
 * @param {number} [options.max=100] - Maximum number of requests per IP in the window
 * @param {string} [options.message] - Message returned when the limit is exceeded
 * @returns {Function} Express middleware that applies the rate limit
 */
export const createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
        ...options,
    });
};

/**
 * Global Limiter
 * - Applies a general limit across all routes.
 * - Protects against flooding/DDoS without being too strict.
 */
export const globalLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
});

/**
 * Login Limiter
 * - Prevents brute force attacks on login.
 */
export const loginLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,
    message: "Too many login attempts. Please try again after 5 minutes.",
});

/**
 * Registration Limiter
 * - Prevents mass account creation.
 */
export const registrationLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: "Too many accounts created from this IP. Please try again later.",
});

/**
 * Logout Limiter
 * - Usually light, just to avoid spam calls.
 */
export const logoutLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50,
});

/**
 * Refresh Access Token Limiter
 * - Protects refresh token endpoint from abuse.
 */
export const refreshTokenLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many refresh requests. Please slow down.",
});

/**
 * File Upload Limiter
 * - Limits file uploads to prevent storage and bandwidth abuse.
 */
export const uploadLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: "Too many upload attempts. Please try again later.",
});

/**
 * Password Reset Limiter
 * - Prevents abuse of password reset functionality.
 */
export const passwordResetLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: "Too many password reset attempts. Please try again later.",
});

/**
 * API Search Limiter
 * - Prevents excessive queries on public search endpoints.
 */
export const searchLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: "Too many search requests. Please try again in a minute.",
});

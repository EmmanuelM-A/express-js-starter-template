/**
 * Enhanced CORS configurations.
 *
 * @type {Object}
 */
export const corsConfigurations = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow localhost with any port
        if (process.env.NODE_ENV !== 'production') {
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
        }

        // NOTE: ADD YOUR ALLOWED ORIGINS HERE
        const allowedOrigins = [
            'http://localhost:5173', // Vite default
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200, // NOTE: SOME LEGACY BROWSERS CHOKE ON 204
    preflightContinue: false
};
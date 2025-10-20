/**
 * Helmet configurations with adjusted CSP for CORS.
 *
 * @type {{crossOriginEmbedderPolicy: boolean, contentSecurityPolicy: {directives: {defaultSrc: string[], connectSrc: string[]}}}}
 */
export const helmetConfigurations = {
    crossOriginEmbedderPolicy: false, // IMPORTANT: Disable if causing CORS issues
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:*", "https://localhost:*"]
        }
    }
}
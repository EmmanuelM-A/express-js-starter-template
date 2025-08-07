/** 
 * Logger Interface defines the contract for all loggers used in the application.
 * 
 * Any custom or third-party logger should implement this interface to maintain 
 * consistent logging behavior across the application. 
 * 
 * Common use cases include logging informational messages, warnings, errors, 
 * debug traces, and supporting different log levels.
 *
 * Implementers should override all methods to integrate with their preferred
 * logging mechanism (e.g., Winston, Bunyan, console, external services).
 */
export default class LoggerInterface {
    /**
     * Logs informational messages, such as successful operations or high-level events.
     * 
     * Use this to track the flow of the application, successful user actions,
     * startup sequences, etc.
     *
     * @param {string} message The main message to log (human-readable).
     * @param {Object} [meta] Optional metadata object for additional context (e.g., user info, request ID).
     * @throws {Error} Throws error if not implemented by subclass.
     */
    info(message, meta) {
        throw new Error('Method "info" must be implemented');
    }

    /**
     * Logs warning messages, such as deprecated usage, slow responses, or non-critical issues.
     *
     * Use this when something unexpected occurred but the app can recover or continue.
     *
     * @param {string} message The warning message to log.
     * @param {Object} [meta] Optional metadata for context (e.g., stack trace, resource info).
     * @throws {Error} Throws error if not implemented by subclass.
     */
    warn(message, meta) {
        throw new Error('Method "warn" must be implemented');
    }

    /**
     * Logs error messages for failed operations or exceptions.
     *
     * Use this to capture system failures, unhandled exceptions, or application-breaking conditions.
     *
     * @param {string} message The error message to log.
     * @param {Object} [meta] Optional metadata such as the error object, stack trace, or context data.
     * @throws {Error} Throws error if not implemented by subclass.
     */
    error(message, meta) {
        throw new Error('Method "error" must be implemented');
    }

    /**
     * Logs detailed debugging information useful during development.
     *
     * Use this to trace logic flow, variable states, or diagnose issues during development/testing.
     *
     * @param {string} message The debug message to log.
     * @param {Object} [meta] Optional additional context such as input/output data or execution timing.
     * @throws {Error} Throws error if not implemented by subclass.
     */
    debug(message, meta) {
        throw new Error('Method "debug" must be implemented');
    }

    /**
     * Generic log method that allows specifying the log level dynamically.
     *
     * Use this for custom log levels or when determining the level programmatically.
     *
     * @param {'info'|'warn'|'error'|'debug'|string} level The log level to use.
     * @param {string} message The message to log.
     * @param {Object} [meta] Optional metadata for contextual information.
     * @throws {Error} Throws error if not implemented by subclass.
     */
    log(level, message, meta) {
        throw new Error('Method "log" must be implemented');
    }
}
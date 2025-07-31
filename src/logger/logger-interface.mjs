/**
 * LoggerInterface defines the contract for all loggers used in the application.
 * Any custom or third-party logger should implement this interface to maintain 
 * compatibility.
 */
export default class LoggerInterface {
    info(message, meta) {
        throw new Error('Method "info" must be implemented');
    }

    warn(message, meta) {
        throw new Error('Method "warn" must be implemented');
    }

    error(message, meta) {
        throw new Error('Method "error" must be implemented');
    }

    debug(message, meta) {
        throw new Error('Method "debug" must be implemented');
    }

    log(level, message, meta) {
        throw new Error('Method "log" must be implemented');
    }
}
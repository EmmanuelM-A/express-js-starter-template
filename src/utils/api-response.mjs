
// TODO: ADD DOCUMENTATION

class ApiResponse {
    constructor(success, message) {
        this.success = success;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }

    toJson() {
        return JSON.parse(JSON.stringify(this));
    }
}

export class ApiSuccessResponse extends ApiResponse {
    constructor(message, data = null) {
        super(true, message);
        if (data) this.data = data;
    }
}


export class ApiErrorResponse extends ApiResponse {
    constructor(message, code , details = null, stackTrace = null) {
        super(false, message);
        this.error = { code, details };

        if (process.env.NODE_ENV === 'development' && stackTrace) {
            this.error.stackTrace = stackTrace;
        }
    }
}

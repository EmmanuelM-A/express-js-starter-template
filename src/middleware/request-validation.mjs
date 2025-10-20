import {throwUnprocessableEntityError} from "../errors/custom-errors.mjs";


/**
 * A validation middleware that validates incoming requests against a pre-defined Joi schema.
 *
 * The schema should expect an object with `body`, `query`, `params` and any additional options.
 * If validation fails, an error of status code 442 (UNPROCESSABLE_ENTITY) is raised, otherwise the request continues.
 *
 * @param {import("joi").Schema} schema The Joi schema to validate request data against.
 *
 */
export const validateRequest = (schema) => (request, response, next) => {
    const { error, value } = schema.validate(
        { body: request.body, query: request.query, params: request.params },
        { abortEarly: false, allowUnknown: true }
    );

    if (error) {
        throwUnprocessableEntityError(
            "Request validation failed",
            "INVALID_REQUEST_DATA",
            error.details.map(d => d.message).join("; ")
        );
    }

    // Reassign validated values // NOTE: LOOK INTO THIS
    // request.body = value.body;
    // request.query = value.query;
    // request.params = value.params;

    next();
};
import {ValidationError} from "../errors/custom-errors.mjs";


export const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
    });

    if (error) throw ValidationError("Request validation failed", "INVALID_REQUEST");

    next();
};
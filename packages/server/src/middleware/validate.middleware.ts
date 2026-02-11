import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { sendErrorResponse } from '../utils/helpers';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return sendErrorResponse(
                    res,
                    MESSAGES.VALIDATION_ERROR,
                    HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    errors
                );
            }
            next(error);
        }
    };
};

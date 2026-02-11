import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/helpers';
import { HTTP_STATUS } from '../utils/constants';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        return sendErrorResponse(
            res,
            'A record with this value already exists',
            HTTP_STATUS.CONFLICT
        );
    }

    if (err.code === 'P2025') {
        return sendErrorResponse(
            res,
            'Record not found',
            HTTP_STATUS.NOT_FOUND
        );
    }

    // Default error
    return sendErrorResponse(
        res,
        err.message || 'Internal server error',
        err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
};

export const notFoundHandler = (
    req: Request,
    res: Response
) => {
    return sendErrorResponse(
        res,
        `Route ${req.originalUrl} not found`,
        HTTP_STATUS.NOT_FOUND
    );
};

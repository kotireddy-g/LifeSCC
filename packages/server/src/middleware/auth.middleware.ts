import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/helpers';
import { sendErrorResponse } from '../utils/helpers';
import { HTTP_STATUS, MESSAGES, ROLE } from '../utils/constants';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendErrorResponse(
                res,
                MESSAGES.TOKEN_REQUIRED,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return sendErrorResponse(
                res,
                MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, isActive: true }
        });

        if (!user || !user.isActive) {
            return sendErrorResponse(
                res,
                MESSAGES.UNAUTHORIZED,
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return sendErrorResponse(
            res,
            MESSAGES.SERVER_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const authorizeAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return sendErrorResponse(
            res,
            MESSAGES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    if (req.user.role !== ROLE.ADMIN && req.user.role !== ROLE.SUPER_ADMIN) {
        return sendErrorResponse(
            res,
            MESSAGES.ADMIN_REQUIRED,
            HTTP_STATUS.FORBIDDEN
        );
    }

    next();
};

export const authorizeSuperAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return sendErrorResponse(
            res,
            MESSAGES.UNAUTHORIZED,
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    if (req.user.role !== ROLE.SUPER_ADMIN) {
        return sendErrorResponse(
            res,
            'Super admin access required',
            HTTP_STATUS.FORBIDDEN
        );
    }

    next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);

        if (decoded) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, role: true, isActive: true }
            });

            if (user && user.isActive) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                };
            }
        }

        next();
    } catch (error) {
        next();
    }
};

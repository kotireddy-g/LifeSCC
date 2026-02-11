import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });
};

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (error) {
        return null;
    }
};

export const sendSuccessResponse = (
    res: Response,
    data: any,
    message: string = 'Success',
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendErrorResponse = (
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

export const generateTimeSlots = (
    openingTime: string,
    closingTime: string,
    slotDuration: number = 30,
    bookedSlots: string[] = []
): string[] => {
    const slots: string[] = [];
    const [openHour, openMin] = openingTime.split(':').map(Number);
    const [closeHour, closeMin] = closingTime.split(':').map(Number);

    let current = openHour * 60 + openMin;
    const end = closeHour * 60 + closeMin;

    while (current + slotDuration <= end) {
        const hour = Math.floor(current / 60);
        const min = current % 60;
        const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        if (!bookedSlots.includes(timeSlot)) {
            slots.push(timeSlot);
        }

        current += slotDuration;
    }

    return slots;
};

export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export const parseFilters = (query: any) => {
    const filters: any = {};

    if (query.search) {
        filters.search = query.search;
    }

    if (query.status) {
        filters.status = query.status;
    }

    if (query.categoryId) {
        filters.categoryId = query.categoryId;
    }

    if (query.branchId) {
        filters.branchId = query.branchId;
    }

    if (query.serviceId) {
        filters.serviceId = query.serviceId;
    }

    if (query.startDate && query.endDate) {
        filters.startDate = new Date(query.startDate);
        filters.endDate = new Date(query.endDate);
    }

    return filters;
};

export const getPagination = (page?: string, limit?: string) => {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    const skip = (pageNum - 1) * limitNum;

    return {
        skip,
        take: limitNum,
        page: pageNum,
        limit: limitNum
    };
};

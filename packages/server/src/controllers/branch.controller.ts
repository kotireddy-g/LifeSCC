import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    sendSuccessResponse,
    sendErrorResponse,
    generateTimeSlots,
    getPagination
} from '../utils/helpers';
import { HTTP_STATUS, MESSAGES, SLOT_DURATION } from '../utils/constants';

const prisma = new PrismaClient();

export const getAllBranches = async (req: AuthRequest, res: Response) => {
    try {
        const { city, state, isActive, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        const where: any = {};

        if (isActive === undefined || isActive === 'true') {
            where.isActive = true;
        }

        if (city) {
            where.city = { contains: city as string, mode: 'insensitive' };
        }

        if (state) {
            where.state = { contains: state as string, mode: 'insensitive' };
        }

        const [branches, total] = await Promise.all([
            prisma.branch.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            appointments: true,
                            services: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { name: 'asc' }
            }),
            prisma.branch.count({ where })
        ]);

        return sendSuccessResponse(res, {
            branches,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get branches error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getBranchById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        appointments: true,
                        services: true
                    }
                }
            }
        });

        if (!branch) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        return sendSuccessResponse(res, branch);
    } catch (error) {
        console.error('Get branch by ID error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getBranchServices = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const branchServices = await prisma.branchService.findMany({
            where: {
                branchId: id,
                isActive: true,
                service: {
                    isActive: true
                }
            },
            include: {
                service: {
                    include: {
                        category: true
                    }
                }
            }
        });

        const services = branchServices.map(bs => bs.service);

        return sendSuccessResponse(res, services);
    } catch (error) {
        console.error('Get branch services error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getBranchTimeSlots = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { date, serviceId } = req.query;

        if (!date) {
            return sendErrorResponse(res, 'Date parameter is required', HTTP_STATUS.BAD_REQUEST);
        }

        // Get branch details
        const branch = await prisma.branch.findUnique({
            where: { id },
            select: { openingTime: true, closingTime: true, isActive: true }
        });

        if (!branch || !branch.isActive) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Parse date
        const appointmentDate = new Date(date as string);
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find all booked slots for this date and branch
        const bookedAppointments = await prisma.appointment.findMany({
            where: {
                branchId: id,
                appointmentDate: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            },
            select: {
                timeSlot: true
            }
        });

        const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

        // Generate available slots
        const availableSlots = generateTimeSlots(
            branch.openingTime,
            branch.closingTime,
            SLOT_DURATION,
            bookedSlots
        );

        return sendSuccessResponse(res, {
            date: appointmentDate,
            availableSlots,
            totalSlots: availableSlots.length
        });
    } catch (error) {
        console.error('Get branch time slots error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const createBranch = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            code,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            latitude,
            longitude,
            openingTime,
            closingTime,
            image
        } = req.body;

        // Check if code already exists
        const existing = await prisma.branch.findUnique({ where: { code } });
        if (existing) {
            return sendErrorResponse(res, 'Branch with this code already exists', HTTP_STATUS.CONFLICT);
        }

        const branch = await prisma.branch.create({
            data: {
                name,
                code,
                address,
                city,
                state,
                pincode,
                phone,
                email,
                latitude,
                longitude,
                openingTime,
                closingTime,
                image
            }
        });

        return sendSuccessResponse(res, branch, MESSAGES.CREATED, HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Create branch error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateBranch = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            code,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            latitude,
            longitude,
            openingTime,
            closingTime,
            isActive,
            image
        } = req.body;

        const existing = await prisma.branch.findUnique({ where: { id } });
        if (!existing) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Check code uniqueness if changed
        if (code && code !== existing.code) {
            const codeExists = await prisma.branch.findUnique({ where: { code } });
            if (codeExists) {
                return sendErrorResponse(res, 'Branch with this code already exists', HTTP_STATUS.CONFLICT);
            }
        }

        const branch = await prisma.branch.update({
            where: { id },
            data: {
                name,
                code,
                address,
                city,
                state,
                pincode,
                phone,
                email,
                latitude,
                longitude,
                openingTime,
                closingTime,
                isActive,
                image
            }
        });

        return sendSuccessResponse(res, branch, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update branch error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const deleteBranch = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Soft delete
        await prisma.branch.update({
            where: { id },
            data: { isActive: false }
        });

        return sendSuccessResponse(res, null, MESSAGES.DELETED);
    } catch (error) {
        console.error('Delete branch error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

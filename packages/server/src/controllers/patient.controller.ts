import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    sendSuccessResponse,
    sendErrorResponse,
    getPagination
} from '../utils/helpers';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

const prisma = new PrismaClient();

export const getAllPatients = async (req: AuthRequest, res: Response) => {
    try {
        const { search, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        const where: any = {
            role: 'PATIENT'
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
                { phone: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [patients, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    dateOfBirth: true,
                    gender: true,
                    city: true,
                    state: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            appointments: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        return sendSuccessResponse(res, {
            patients,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get all patients error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getPatientById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const patient = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                appointments: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        },
                        branch: {
                            select: {
                                id: true,
                                name: true,
                                city: true
                            }
                        }
                    },
                    orderBy: { appointmentDate: 'desc' }
                },
                _count: {
                    select: {
                        appointments: true,
                        leads: true
                    }
                }
            }
        });

        if (!patient || patient === null) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        return sendSuccessResponse(res, patient);
    } catch (error) {
        console.error('Get patient by ID error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            phone,
            dateOfBirth,
            gender,
            address,
            city,
            state,
            pincode,
            isActive
        } = req.body;

        const patient = await prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender,
                address,
                city,
                state,
                pincode,
                isActive
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                isActive: true,
                updatedAt: true
            }
        });

        return sendSuccessResponse(res, patient, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update patient error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

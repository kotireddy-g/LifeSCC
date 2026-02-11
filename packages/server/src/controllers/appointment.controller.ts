import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    sendSuccessResponse,
    sendErrorResponse,
    getPagination
} from '../utils/helpers';
import { HTTP_STATUS, MESSAGES, APPOINTMENT_STATUS } from '../utils/constants';
import { sendAppointmentConfirmationEmail } from '../utils/email';

const prisma = new PrismaClient();

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const { status, branchId, serviceId, startDate, endDate, search, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        const where: any = {};

        if (status) {
            where.status = status as string;
        }

        if (branchId) {
            where.branchId = branchId as string;
        }

        if (serviceId) {
            where.serviceId = serviceId as string;
        }

        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            };
        }

        if (search) {
            where.OR = [
                { patientName: { contains: search as string, mode: 'insensitive' } },
                { patientPhone: { contains: search as string, mode: 'insensitive' } },
                { patientEmail: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true
                        }
                    },
                    service: {
                        select: {
                            id: true,
                            name: true,
                            duration: true,
                            price: true
                        }
                    },
                    branch: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            address: true,
                            city: true,
                            phone: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { appointmentDate: 'desc' }
            }),
            prisma.appointment.count({ where })
        ]);

        return sendSuccessResponse(res, {
            appointments,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get all appointments error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        }

        const { status } = req.query;

        const where: any = {
            userId: req.user.id
        };

        if (status) {
            where.status = status as string;
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        duration: true,
                        price: true,
                        image: true
                    }
                },
                branch: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        address: true,
                        city: true,
                        phone: true
                    }
                }
            },
            orderBy: { appointmentDate: 'desc' }
        });

        return sendSuccessResponse(res, appointments);
    } catch (error) {
        console.error('Get my appointments error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true
                    }
                },
                service: {
                    include: {
                        category: true
                    }
                },
                branch: true
            }
        });

        if (!appointment) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Check authorization for patients
        if (req.user && req.user.role === 'PATIENT' && appointment.userId !== req.user.id) {
            return sendErrorResponse(res, MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
        }

        return sendSuccessResponse(res, appointment);
    } catch (error) {
        console.error('Get appointment by ID error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const {
            appointmentDate,
            timeSlot,
            patientName,
            patientPhone,
            patientEmail,
            serviceId,
            branchId,
            notes
        } = req.body;

        // Verify service and branch exist
        const [service, branch] = await Promise.all([
            prisma.service.findUnique({ where: { id: serviceId } }),
            prisma.branch.findUnique({ where: { id: branchId } })
        ]);

        if (!service || !branch) {
            return sendErrorResponse(res, 'Invalid service or branch', HTTP_STATUS.BAD_REQUEST);
        }

        // Check if time slot is available
        const date = new Date(appointmentDate);
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                branchId,
                appointmentDate: date,
                timeSlot,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        });

        if (existingAppointment) {
            return sendErrorResponse(res, 'This time slot is already booked', HTTP_STATUS.CONFLICT);
        }

        // Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                appointmentDate: date,
                timeSlot,
                patientName,
                patientPhone,
                patientEmail,
                userId: req.user?.id,
                serviceId,
                branchId,
                notes,
                status: 'PENDING'
            },
            include: {
                service: true,
                branch: true,
                user: true
            }
        });

        // Send confirmation email if email is provided
        if (patientEmail) {
            sendAppointmentConfirmationEmail(patientEmail, {
                patientName,
                serviceName: service.name,
                branchName: branch.name,
                date: date.toLocaleDateString(),
                time: timeSlot,
                branchAddress: branch.address,
                branchPhone: branch.phone
            }).catch(console.error);
        }

        return sendSuccessResponse(res, appointment, 'Appointment booked successfully', HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Create appointment error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status,
                adminNotes
            },
            include: {
                service: true,
                branch: true,
                user: true
            }
        });

        return sendSuccessResponse(res, appointment, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update appointment status error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const rescheduleAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { appointmentDate, timeSlot } = req.body;

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Check if new time slot is available
        const date = new Date(appointmentDate);
        const conflictingAppointment = await prisma.appointment.findFirst({
            where: {
                branchId: existing.branchId,
                appointmentDate: date,
                timeSlot,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                },
                NOT: { id }
            }
        });

        if (conflictingAppointment) {
            return sendErrorResponse(res, 'This time slot is already booked', HTTP_STATUS.CONFLICT);
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                appointmentDate: date,
                timeSlot,
                status: 'RESCHEDULED'
            },
            include: {
                service: true,
                branch: true,
                user: true
            }
        });

        return sendSuccessResponse(res, appointment, 'Appointment rescheduled successfully');
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Check authorization for patients
        if (req.user && req.user.role === 'PATIENT' && existing.userId !== req.user.id) {
            return sendErrorResponse(res, MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelReason
            },
            include: {
                service: true,
                branch: true,
                user: true
            }
        });

        return sendSuccessResponse(res, appointment, 'Appointment cancelled successfully');
    } catch (error) {
        console.error('Cancel appointment error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

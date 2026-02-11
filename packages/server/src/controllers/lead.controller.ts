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

export const getAllLeads = async (req: AuthRequest, res: Response) => {
    try {
        const { status, source, startDate, endDate, search, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        const where: any = {};

        if (status) {
            where.status = status as string;
        }

        if (source) {
            where.source = source as string;
        }

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { phone: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.lead.count({ where })
        ]);

        return sendSuccessResponse(res, {
            leads,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get all leads error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const createLead = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone, message, serviceInterest, source } = req.body;

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                message,
                serviceInterest,
                source: source || 'WEBSITE_FORM',
                userId: req.user?.id
            }
        });

        return sendSuccessResponse(res, lead, 'Lead created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Create lead error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, notes, followUpDate, serviceInterest } = req.body;

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status,
                assignedTo,
                notes,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
                serviceInterest
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return sendSuccessResponse(res, lead, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update lead error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const convertLeadToAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { serviceId, branchId, appointmentDate, timeSlot } = req.body;

        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Create appointment from lead
        const appointment = await prisma.appointment.create({
            data: {
                patientName: lead.name,
                patientPhone: lead.phone,
                patientEmail: lead.email || undefined,
                userId: lead.userId || undefined,
                serviceId,
                branchId,
                appointmentDate: new Date(appointmentDate),
                timeSlot,
                status: 'PENDING',
                notes: `Converted from lead. Original message: ${lead.message || 'N/A'}`
            },
            include: {
                service: true,
                branch: true
            }
        });

        // Update lead status to CONVERTED
        await prisma.lead.update({
            where: { id },
            data: { status: 'CONVERTED' }
        });

        return sendSuccessResponse(res, appointment, 'Lead converted to appointment successfully');
    } catch (error) {
        console.error('Convert lead error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.lead.delete({ where: { id } });

        return sendSuccessResponse(res, null, MESSAGES.DELETED);
    } catch (error) {
        console.error('Delete lead error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

// Contact message functions
export const createContactMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                subject,
                message
            }
        });

        return sendSuccessResponse(res, contactMessage, 'Message sent successfully', HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Create contact message error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getAllContactMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { isRead, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        const where: any = {};
        if (isRead !== undefined) {
            where.isRead = isRead === 'true';
        }

        const [messages, total] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.contactMessage.count({ where })
        ]);

        return sendSuccessResponse(res, {
            messages,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get contact messages error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const markMessageAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true }
        });

        return sendSuccessResponse(res, message, 'Message marked as read');
    } catch (error) {
        console.error('Mark message as read error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

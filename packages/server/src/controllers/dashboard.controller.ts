import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalAppointments,
            todayAppointments,
            weekAppointments,
            monthAppointments,
            totalPatients,
            totalLeads,
            newLeads,
            appointmentsByStatus,
            leadsByStatus
        ] = await Promise.all([
            prisma.appointment.count(),
            prisma.appointment.count({
                where: {
                    appointmentDate: {
                        gte: startOfToday
                    }
                }
            }),
            prisma.appointment.count({
                where: {
                    appointmentDate: {
                        gte: startOfWeek
                    }
                }
            }),
            prisma.appointment.count({
                where: {
                    appointmentDate: {
                        gte: startOfMonth
                    }
                }
            }),
            prisma.user.count({
                where: { role: 'PATIENT' }
            }),
            prisma.lead.count(),
            prisma.lead.count({
                where: {
                    createdAt: {
                        gte: startOfWeek
                    }
                }
            }),
            prisma.appointment.groupBy({
                by: ['status'],
                _count: true
            }),
            prisma.lead.groupBy({
                by: ['status'],
                _count: true
            })
        ]);

        // Calculate estimated revenue (from completed appointments)
        const completedAppointments = await prisma.appointment.findMany({
            where: { status: 'COMPLETED' },
            include: {
                service: {
                    select: { price: true }
                }
            }
        });

        const estimatedRevenue = completedAppointments.reduce((sum, apt) => {
            return sum + (apt.service.price || 0);
        }, 0);

        // Calculate completion rate
        const completedCount = appointmentsByStatus.find(s => s.status === 'COMPLETED')?._count || 0;
        const completionRate = totalAppointments > 0
            ? ((completedCount / totalAppointments) * 100).toFixed(1)
            : '0';

        const stats = {
            totalAppointments,
            todayAppointments,
            weekAppointments,
            monthAppointments,
            totalPatients,
            totalLeads,
            newLeads,
            estimatedRevenue,
            completionRate: parseFloat(completionRate),
            appointmentsByStatus: appointmentsByStatus.map(s => ({
                status: s.status,
                count: s._count
            })),
            leadsByStatus: leadsByStatus.map(s => ({
                status: s.status,
                count: s._count
            }))
        };

        return sendSuccessResponse(res, stats);
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getAppointmentChart = async (req: AuthRequest, res: Response) => {
    try {
        const { days = '30' } = req.query;
        const daysNum = parseInt(days as string);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysNum);
        startDate.setHours(0, 0, 0, 0);

        const appointments = await prisma.appointment.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            select: {
                createdAt: true,
                status: true
            }
        });

        // Group by date
        const dateMap: Record<string, { date: string; count: number; confirmed: number; pending: number; completed: number }> = {};

        appointments.forEach(apt => {
            const date = new Date(apt.createdAt).toISOString().split('T')[0];

            if (!dateMap[date]) {
                dateMap[date] = { date, count: 0, confirmed: 0, pending: 0, completed: 0 };
            }

            dateMap[date].count++;

            if (apt.status === 'CONFIRMED') dateMap[date].confirmed++;
            if (apt.status === 'PENDING') dateMap[date].pending++;
            if (apt.status === 'COMPLETED') dateMap[date].completed++;
        });

        const chartData = Object.values(dateMap).sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return sendSuccessResponse(res, chartData);
    } catch (error) {
        console.error('Get appointment chart error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getPopularServices = async (req: AuthRequest, res: Response) => {
    try {
        const { limit = '10' } = req.query;

        const services = await prisma.appointment.groupBy({
            by: ['serviceId'],
            _count: true,
            orderBy: {
                _count: {
                    serviceId: 'desc'
                }
            },
            take: parseInt(limit as string)
        });

        // Get service details
        const serviceDetails = await Promise.all(
            services.map(async (s) => {
                const service = await prisma.service.findUnique({
                    where: { id: s.serviceId },
                    include: {
                        category: {
                            select: { name: true }
                        }
                    }
                });

                return {
                    service,
                    bookingCount: s._count
                };
            })
        );

        return sendSuccessResponse(res, serviceDetails);
    } catch (error) {
        console.error('Get popular services error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getBranchPerformance = async (req: AuthRequest, res: Response) => {
    try {
        const branches = await prisma.branch.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                code: true,
                city: true
            }
        });

        const branchPerformance = await Promise.all(
            branches.map(async (branch) => {
                const [totalAppointments, completedAppointments, revenue] = await Promise.all([
                    prisma.appointment.count({
                        where: { branchId: branch.id }
                    }),
                    prisma.appointment.count({
                        where: {
                            branchId: branch.id,
                            status: 'COMPLETED'
                        }
                    }),
                    prisma.appointment.findMany({
                        where: {
                            branchId: branch.id,
                            status: 'COMPLETED'
                        },
                        include: {
                            service: {
                                select: { price: true }
                            }
                        }
                    })
                ]);

                const totalRevenue = revenue.reduce((sum, apt) => sum + (apt.service.price || 0), 0);

                return {
                    branch,
                    totalAppointments,
                    completedAppointments,
                    revenue: totalRevenue,
                    completionRate: totalAppointments > 0
                        ? ((completedAppointments / totalAppointments) * 100).toFixed(1)
                        : '0'
                };
            })
        );

        return sendSuccessResponse(res, branchPerformance);
    } catch (error) {
        console.error('Get branch performance error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
    try {
        const { limit = '10' } = req.query;
        const limitNum = parseInt(limit as string);

        const [recentAppointments, recentLeads] = await Promise.all([
            prisma.appointment.findMany({
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                include: {
                    service: {
                        select: { name: true }
                    },
                    branch: {
                        select: { name: true }
                    },
                    user: {
                        select: { firstName: true, lastName: true }
                    }
                }
            }),
            prisma.lead.findMany({
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    serviceInterest: true,
                    status: true,
                    source: true,
                    createdAt: true
                }
            })
        ]);

        return sendSuccessResponse(res, {
            recentAppointments,
            recentLeads
        });
    } catch (error) {
        console.error('Get recent activity error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

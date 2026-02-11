import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    sendSuccessResponse,
    sendErrorResponse,
    parseFilters,
    getPagination
} from '../utils/helpers';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';

const prisma = new PrismaClient();

export const getAllServices = async (req: AuthRequest, res: Response) => {
    try {
        const { search, categoryId, branchId, isPopular, page, limit } = req.query;
        const { skip, take } = getPagination(page as string, limit as string);

        // Build where clause
        const where: any = {
            isActive: true
        };

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId as string;
        }

        if (isPopular === 'true') {
            where.isPopular = true;
        }

        // If branch filter is provided, only get services available at that branch
        if (branchId) {
            where.branches = {
                some: {
                    branchId: branchId as string,
                    isActive: true
                }
            };
        }

        const [services, total] = await Promise.all([
            prisma.service.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    branches: {
                        where: branchId ? { branchId: branchId as string } : {},
                        select: {
                            branch: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true
                                }
                            }
                        }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.service.count({ where })
        ]);

        return sendSuccessResponse(res, {
            services,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error('Get services error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getServiceBySlug = async (req: AuthRequest, res: Response) => {
    try {
        const { slug } = req.params;

        const service = await prisma.service.findUnique({
            where: { slug },
            include: {
                category: true,
                branches: {
                    where: { isActive: true },
                    include: {
                        branch: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                address: true,
                                city: true,
                                state: true,
                                phone: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!service) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        return sendSuccessResponse(res, service);
    } catch (error) {
        console.error('Get service by slug error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.serviceCategory.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { services: true }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });

        return sendSuccessResponse(res, categories);
    } catch (error) {
        console.error('Get categories error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const createService = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            slug,
            description,
            shortDesc,
            duration,
            price,
            discountPrice,
            image,
            benefits,
            isPopular,
            categoryId,
            branchIds
        } = req.body;

        // Check if slug already exists
        const existing = await prisma.service.findUnique({ where: { slug } });
        if (existing) {
            return sendErrorResponse(res, 'Service with this slug already exists', HTTP_STATUS.CONFLICT);
        }

        // Create service
        const service = await prisma.service.create({
            data: {
                name,
                slug,
                description,
                shortDesc,
                duration,
                price,
                discountPrice,
                image,
                benefits,
                isPopular,
                categoryId
            },
            include: {
                category: true
            }
        });

        // Create branch associations if provided
        if (branchIds && Array.isArray(branchIds) && branchIds.length > 0) {
            await prisma.branchService.createMany({
                data: branchIds.map((branchId: string) => ({
                    branchId,
                    serviceId: service.id
                }))
            });
        }

        return sendSuccessResponse(res, service, MESSAGES.CREATED, HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Create service error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateService = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            slug,
            description,
            shortDesc,
            duration,
            price,
            discountPrice,
            image,
            benefits,
            isPopular,
            categoryId,
            isActive,
            branchIds
        } = req.body;

        // Check if service exists
        const existing = await prisma.service.findUnique({ where: { id } });
        if (!existing) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Check slug uniqueness if changed
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.service.findUnique({ where: { slug } });
            if (slugExists) {
                return sendErrorResponse(res, 'Service with this slug already exists', HTTP_STATUS.CONFLICT);
            }
        }

        // Update service
        const service = await prisma.service.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                shortDesc,
                duration,
                price,
                discountPrice,
                image,
                benefits,
                isPopular,
                categoryId,
                isActive
            },
            include: {
                category: true
            }
        });

        // Update branch associations if provided
        if (branchIds && Array.isArray(branchIds)) {
            // Delete existing associations
            await prisma.branchService.deleteMany({
                where: { serviceId: id }
            });

            // Create new associations
            if (branchIds.length > 0) {
                await prisma.branchService.createMany({
                    data: branchIds.map((branchId: string) => ({
                        branchId,
                        serviceId: id
                    }))
                });
            }
        }

        return sendSuccessResponse(res, service, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update service error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Soft delete
        await prisma.service.update({
            where: { id },
            data: { isActive: false }
        });

        return sendSuccessResponse(res, null, MESSAGES.DELETED);
    } catch (error) {
        console.error('Delete service error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

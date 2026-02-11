import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createServiceSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().min(1, 'Description is required'),
        shortDesc: z.string().optional(),
        duration: z.number().min(1, 'Duration must be at least 1 minute'),
        price: z.number().min(0, 'Price must be positive'),
        discountPrice: z.number().optional(),
        image: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        isPopular: z.boolean().optional(),
        categoryId: z.string().min(1, 'Category is required'),
        branchIds: z.array(z.string()).optional()
    })
});

const updateServiceSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDesc: z.string().optional(),
        duration: z.number().optional(),
        price: z.number().optional(),
        discountPrice: z.number().optional(),
        image: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        isPopular: z.boolean().optional(),
        categoryId: z.string().optional(),
        isActive: z.boolean().optional(),
        branchIds: z.array(z.string()).optional()
    })
});

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getCategories);
router.get('/:slug', serviceController.getServiceBySlug);

// Admin routes
router.post('/', authenticate, authorizeAdmin, validate(createServiceSchema), serviceController.createService);
router.put('/:id', authenticate, authorizeAdmin, validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', authenticate, authorizeAdmin, serviceController.deleteService);

export default router;

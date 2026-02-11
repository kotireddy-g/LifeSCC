import { Router } from 'express';
import * as branchController from '../controllers/branch.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createBranchSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        code: z.string().min(1, 'Code is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        pincode: z.string().min(1, 'Pincode is required'),
        phone: z.string().min(1, 'Phone is required'),
        email: z.string().email().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
        image: z.string().optional()
    })
});

const updateBranchSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        code: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
        isActive: z.boolean().optional(),
        image: z.string().optional()
    })
});

// Public routes
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.get('/:id/services', branchController.getBranchServices);
router.get('/:id/slots', branchController.getBranchTimeSlots);

// Admin routes
router.post('/', authenticate, authorizeAdmin, validate(createBranchSchema), branchController.createBranch);
router.put('/:id', authenticate, authorizeAdmin, validate(updateBranchSchema), branchController.updateBranch);
router.delete('/:id', authenticate, authorizeAdmin, branchController.deleteBranch);

export default router;

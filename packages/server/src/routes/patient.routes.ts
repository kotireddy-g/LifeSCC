import { Router } from 'express';
import * as patientController from '../controllers/patient.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schema
const updatePatientSchema = z.object({
    body: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(),
        isActive: z.boolean().optional()
    })
});

// All routes require admin authentication
router.get('/', authenticate, authorizeAdmin, patientController.getAllPatients);
router.get('/:id', authenticate, authorizeAdmin, patientController.getPatientById);
router.put('/:id', authenticate, authorizeAdmin, validate(updatePatientSchema), patientController.updatePatient);

export default router;

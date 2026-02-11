import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { authenticate, authorizeAdmin, optionalAuth } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createAppointmentSchema = z.object({
    body: z.object({
        appointmentDate: z.string().min(1, 'Appointment date is required'),
        timeSlot: z.string().min(1, 'Time slot is required'),
        patientName: z.string().min(1, 'Patient name is required'),
        patientPhone: z.string().min(1, 'Patient phone is required'),
        patientEmail: z.string().email().optional(),
        serviceId: z.string().min(1, 'Service is required'),
        branchId: z.string().min(1, 'Branch is required'),
        notes: z.string().optional()
    })
});

const updateStatusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW']),
        adminNotes: z.string().optional()
    })
});

const rescheduleSchema = z.object({
    body: z.object({
        appointmentDate: z.string().min(1, 'Appointment date is required'),
        timeSlot: z.string().min(1, 'Time slot is required')
    })
});

const cancelSchema = z.object({
    body: z.object({
        cancelReason: z.string().optional()
    })
});

// Admin routes
router.get('/', authenticate, authorizeAdmin, appointmentController.getAllAppointments);

// Patient routes
router.get('/my', authenticate, appointmentController.getMyAppointments);

// Shared routes
router.get('/:id', optionalAuth, appointmentController.getAppointmentById);
router.post('/', optionalAuth, validate(createAppointmentSchema), appointmentController.createAppointment);
router.put('/:id/status', authenticate, authorizeAdmin, validate(updateStatusSchema), appointmentController.updateAppointmentStatus);
router.put('/:id/reschedule', optionalAuth, validate(rescheduleSchema), appointmentController.rescheduleAppointment);
router.put('/:id/cancel', optionalAuth, validate(cancelSchema), appointmentController.cancelAppointment);

export default router;

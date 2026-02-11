import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { authenticate, authorizeAdmin, optionalAuth } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createLeadSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        phone: z.string().min(1, 'Phone is required'),
        email: z.string().email().optional(),
        message: z.string().optional(),
        serviceInterest: z.string().optional(),
        source: z.enum(['WEBSITE_FORM', 'CALLBACK_REQUEST', 'PHONE_INQUIRY', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA']).optional()
    })
});

const updateLeadSchema = z.object({
    body: z.object({
        status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'LOST']).optional(),
        assignedTo: z.string().optional(),
        notes: z.string().optional(),
        followUpDate: z.string().optional(),
        serviceInterest: z.string().optional()
    })
});

const convertLeadSchema = z.object({
    body: z.object({
        serviceId: z.string().min(1, 'Service is required'),
        branchId: z.string().min(1, 'Branch is required'),
        appointmentDate: z.string().min(1, 'Appointment date is required'),
        timeSlot: z.string().min(1, 'Time slot is required')
    })
});

const createContactMessageSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Valid email is required'),
        phone: z.string().optional(),
        subject: z.string().min(1, 'Subject is required'),
        message: z.string().min(1, 'Message is required')
    })
});

// Lead routes
router.get('/', authenticate, authorizeAdmin, leadController.getAllLeads);
router.post('/', optionalAuth, validate(createLeadSchema), leadController.createLead);
router.put('/:id', authenticate, authorizeAdmin, validate(updateLeadSchema), leadController.updateLead);
router.put('/:id/convert', authenticate, authorizeAdmin, validate(convertLeadSchema), leadController.convertLeadToAppointment);
router.delete('/:id', authenticate, authorizeAdmin, leadController.deleteLead);

// Contact message routes
router.post('/contact', validate(createContactMessageSchema), leadController.createContactMessage);
router.get('/contact/messages', authenticate, authorizeAdmin, leadController.getAllContactMessages);
router.put('/contact/:id/read', authenticate, authorizeAdmin, leadController.markMessageAsRead);

export default router;

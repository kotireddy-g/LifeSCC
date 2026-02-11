import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require admin authentication
router.get('/stats', authenticate, authorizeAdmin, dashboardController.getDashboardStats);
router.get('/appointments/chart', authenticate, authorizeAdmin, dashboardController.getAppointmentChart);
router.get('/services/popular', authenticate, authorizeAdmin, dashboardController.getPopularServices);
router.get('/branches/performance', authenticate, authorizeAdmin, dashboardController.getBranchPerformance);
router.get('/recent-activity', authenticate, authorizeAdmin, dashboardController.getRecentActivity);

export default router;

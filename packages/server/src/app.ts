import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { API_VERSION } from './utils/constants';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import branchRoutes from './routes/branch.routes';
import appointmentRoutes from './routes/appointment.routes';
import leadRoutes from './routes/lead.routes';
import patientRoutes from './routes/patient.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'LifeSCC API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/services`, serviceRoutes);
app.use(`${API_VERSION}/branches`, branchRoutes);
app.use(`${API_VERSION}/appointments`, appointmentRoutes);
app.use(`${API_VERSION}/leads`, leadRoutes);
app.use(`${API_VERSION}/patients`, patientRoutes);
app.use(`${API_VERSION}/dashboard`, dashboardRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

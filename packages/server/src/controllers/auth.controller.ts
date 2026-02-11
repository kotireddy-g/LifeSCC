import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    sendSuccessResponse,
    sendErrorResponse
} from '../utils/helpers';
import { HTTP_STATUS, MESSAGES } from '../utils/constants';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email';

const prisma = new PrismaClient();

export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, firstName, lastName, phone, dateOfBirth, gender } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(phone ? [{ phone }] : [])
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return sendErrorResponse(res, MESSAGES.USER_EXISTS, HTTP_STATUS.CONFLICT);
            }
            if (existingUser.phone === phone) {
                return sendErrorResponse(res, MESSAGES.PHONE_EXISTS, HTTP_STATUS.CONFLICT);
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender,
                role: 'PATIENT'
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
                isVerified: true,
                createdAt: true
            }
        });

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id });

        // Save refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Send welcome email (don't wait for it)
        sendWelcomeEmail(user.email, user.firstName).catch(console.error);

        return sendSuccessResponse(
            res,
            { user, accessToken, refreshToken },
            'Registration successful',
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error('Register error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return sendErrorResponse(res, MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
        }

        // Check if user is active
        if (!user.isActive) {
            return sendErrorResponse(res, 'Account is deactivated', HTTP_STATUS.FORBIDDEN);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return sendErrorResponse(res, MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id });

        // Save refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Remove password from response
        const { password: _, refreshToken: __, ...userWithoutSensitive } = user;

        return sendSuccessResponse(
            res,
            { user: userWithoutSensitive, accessToken, refreshToken },
            'Login successful'
        );
    } catch (error) {
        console.error('Login error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const refreshAccessToken = async (req: AuthRequest, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendErrorResponse(res, 'Refresh token required', HTTP_STATUS.BAD_REQUEST);
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return sendErrorResponse(res, MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
        }

        // Find user and verify refresh token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.refreshToken !== refreshToken || !user.isActive) {
            return sendErrorResponse(res, MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate new access token
        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });

        return sendSuccessResponse(res, { accessToken }, 'Token refreshed');
    } catch (error) {
        console.error('Refresh token error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        }

        // Clear refresh token
        await prisma.user.update({
            where: { id: req.user.id },
            data: { refreshToken: null }
        });

        return sendSuccessResponse(res, null, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        return sendSuccessResponse(res, user, 'Profile fetched');
    } catch (error) {
        console.error('Get profile error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        }

        const { firstName, lastName, phone, dateOfBirth, gender, address, city, state, pincode } = req.body;

        // Check if phone is being changed and if it's already taken
        if (phone) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    phone,
                    NOT: { id: req.user.id }
                }
            });

            if (existingUser) {
                return sendErrorResponse(res, MESSAGES.PHONE_EXISTS, HTTP_STATUS.CONFLICT);
            }
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                firstName,
                lastName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender,
                address,
                city,
                state,
                pincode
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                avatar: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return sendSuccessResponse(res, user, MESSAGES.UPDATED);
    } catch (error) {
        console.error('Update profile error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
        }

        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return sendErrorResponse(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return sendErrorResponse(res, 'Current password is incorrect', HTTP_STATUS.BAD_REQUEST);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        return sendSuccessResponse(res, null, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Don't reveal if user exists or not
        if (!user) {
            return sendSuccessResponse(
                res,
                null,
                'If the email exists, a password reset link has been sent'
            );
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = generateAccessToken({ id: user.id, type: 'password-reset' });

        // Send password reset email
        const emailSent = await sendPasswordResetEmail(user.email, user.firstName, resetToken);

        if (!emailSent) {
            return sendErrorResponse(res, 'Failed to send email', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return sendSuccessResponse(
            res,
            null,
            'If the email exists, a password reset link has been sent'
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decoded = verifyAccessToken(token);

        if (!decoded || decoded.type !== 'password-reset') {
            return sendErrorResponse(res, 'Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: decoded.id },
            data: { password: hashedPassword, refreshToken: null } // Invalidate all sessions
        });

        return sendSuccessResponse(res, null, 'Password reset successful');
    } catch (error) {
        console.error('Reset password error:', error);
        return sendErrorResponse(res, MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

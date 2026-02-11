import apiService from '../lib/api';
import { ApiResponse, AuthResponse, User } from '../lib/types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

        if (response.success && response.data) {
            apiService.setTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }

    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', data);

        if (response.success && response.data) {
            apiService.setTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response;
    }

    async logout(): Promise<void> {
        try {
            await apiService.post('/auth/logout');
        } finally {
            apiService.clearTokens();
        }
    }

    async getProfile(): Promise<ApiResponse<User>> {
        return apiService.get<ApiResponse<User>>('/auth/me');
    }

    async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
        return apiService.put<ApiResponse<User>>('/auth/me', data);
    }

    async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
        return apiService.put<ApiResponse>('/auth/change-password', data);
    }

    async forgotPassword(email: string): Promise<ApiResponse> {
        return apiService.post<ApiResponse>('/auth/forgot-password', { email });
    }

    async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
        return apiService.post<ApiResponse>('/auth/reset-password', { token, newPassword });
    }

    isAuthenticated(): boolean {
        return !!apiService.getAccessToken();
    }
}

export const authService = new AuthService();
export default authService;

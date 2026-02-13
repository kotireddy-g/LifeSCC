import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://192.168.1.2:3000/api/v1'  // Use your computer's local IP when testing on device
    : 'https://your-production-api.com/api/v1';

class ApiService {
    private token: string | null = null;

    async setToken(token: string) {
        this.token = token;
        await AsyncStorage.setItem('authToken', token);
    }

    async getToken() {
        if (!this.token) {
            this.token = await AsyncStorage.getItem('authToken');
        }
        return this.token;
    }

    async clearToken() {
        this.token = null;
        await AsyncStorage.removeItem('authToken');
    }

    private async request(method: string, endpoint: string, data?: any) {
        try {
            const token = await this.getToken();
            const headers: any = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios({
                method,
                url: `${API_BASE_URL}${endpoint}`,
                data,
                headers,
            });

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                await this.clearToken();
            }
            throw error.response?.data || error;
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const response = await this.request('POST', '/auth/login', { email, password });
        if (response.data.accessToken) {
            await this.setToken(response.data.accessToken);
        }
        return response;
    }

    async register(userData: any) {
        return await this.request('POST', '/auth/register', userData);
    }

    async logout() {
        await this.clearToken();
    }

    // Services
    async getServices() {
        return await this.request('GET', '/services');
    }

    async getServiceById(id: string) {
        return await this.request('GET', `/services/${id}`);
    }

    // Branches
    async getBranches() {
        return await this.request('GET', '/branches');
    }

    // Appointments
    async getMyAppointments() {
        return await this.request('GET', '/appointments/me');
    }

    async createAppointment(appointmentData: any) {
        return await this.request('POST', '/appointments', appointmentData);
    }

    async cancelAppointment(id: string, reason: string) {
        return await this.request('PUT', `/appointments/${id}/cancel`, { cancelReason: reason });
    }

    // Profile
    async getProfile() {
        return await this.request('GET', '/auth/me');
    }

    async updateProfile(profileData: any) {
        return await this.request('PUT', '/auth/profile', profileData);
    }
}

export const apiService = new ApiService();
export default apiService;

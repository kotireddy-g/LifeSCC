import apiService from '../lib/api';
import { ApiResponse, DashboardStats } from '../lib/types';

class DashboardService {
    async getStats(): Promise<ApiResponse<DashboardStats>> {
        return apiService.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    }

    async getAppointmentChart(days: number = 30): Promise<ApiResponse<any[]>> {
        return apiService.get<ApiResponse<any[]>>(`/dashboard/appointments/chart?days=${days}`);
    }

    async getPopularServices(limit: number = 10): Promise<ApiResponse<any[]>> {
        return apiService.get<ApiResponse<any[]>>(`/dashboard/services/popular?limit=${limit}`);
    }

    async getBranchPerformance(): Promise<ApiResponse<any[]>> {
        return apiService.get<ApiResponse<any[]>>('/dashboard/branches/performance');
    }

    async getRecentActivity(limit: number = 10): Promise<ApiResponse<any>> {
        return apiService.get<ApiResponse<any>>(`/dashboard/recent-activity?limit=${limit}`);
    }
}

export const dashboardService = new DashboardService();
export default dashboardService;

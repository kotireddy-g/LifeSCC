import apiService from '../lib/api';
import { ApiResponse, Appointment } from '../lib/types';

class AdminService {
    async getAllAppointments(params?: {
        page?: number;
        limit?: number;
        status?: string;
        branchId?: string;
        serviceId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<{ appointments: Appointment[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.branchId) queryParams.append('branchId', params.branchId);
        if (params?.serviceId) queryParams.append('serviceId', params.serviceId);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        return apiService.get<ApiResponse<any>>(`/appointments?${queryParams.toString()}`);
    }

    async updateAppointmentStatus(
        id: string,
        status: string,
        adminNotes?: string
    ): Promise<ApiResponse<Appointment>> {
        return apiService.put<ApiResponse<Appointment>>(`/appointments/${id}/status`, {
            status,
            adminNotes
        });
    }
}

export const adminService = new AdminService();
export default adminService;

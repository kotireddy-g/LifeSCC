import apiService from '../lib/api';
import { ApiResponse, Appointment, Lead, User } from '../lib/types';

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

    // Leads Management
    async getAllLeads(params?: {
        page?: number;
        limit?: number;
        status?: string;
        source?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
    }): Promise<ApiResponse<{ leads: Lead[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.source) queryParams.append('source', params.source);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.search) queryParams.append('search', params.search);

        return apiService.get<ApiResponse<any>>(`/leads?${queryParams.toString()}`);
    }

    async updateLead(
        id: string,
        data: {
            status?: string;
            assignedTo?: string;
            notes?: string;
            followUpDate?: string;
            serviceInterest?: string;
        }
    ): Promise<ApiResponse<Lead>> {
        return apiService.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    }

    async convertLeadToAppointment(
        id: string,
        data: {
            serviceId: string;
            branchId: string;
            appointmentDate: string;
            timeSlot: string;
        }
    ): Promise<ApiResponse<Appointment>> {
        return apiService.put<ApiResponse<Appointment>>(`/leads/${id}/convert`, data);
    }

    async deleteLead(id: string): Promise<ApiResponse<null>> {
        return apiService.delete<ApiResponse<null>>(`/leads/${id}`);
    }

    // Patients Management
    async getAllPatients(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<ApiResponse<{ patients: User[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);

        return apiService.get<ApiResponse<any>>(`/patients?${queryParams.toString()}`);
    }
}

export const adminService = new AdminService();
export default adminService;

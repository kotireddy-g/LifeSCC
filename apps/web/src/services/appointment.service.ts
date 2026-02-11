import apiService from '../lib/api';
import { ApiResponse, Appointment } from '../lib/types';

export interface CreateAppointmentData {
    appointmentDate: string;
    timeSlot: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    serviceId: string;
    branchId: string;
    notes?: string;
}

class AppointmentService {
    async createAppointment(data: CreateAppointmentData): Promise<ApiResponse<Appointment>> {
        return apiService.post<ApiResponse<Appointment>>('/appointments', data);
    }

    async getMyAppointments(status?: string): Promise<ApiResponse<Appointment[]>> {
        const params = status ? `?status=${status}` : '';
        return apiService.get<ApiResponse<Appointment[]>>(`/appointments/my${params}`);
    }

    async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
        return apiService.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    }

    async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
        return apiService.put<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, {
            cancelReason: reason
        });
    }

    async rescheduleAppointment(
        id: string,
        appointmentDate: string,
        timeSlot: string
    ): Promise<ApiResponse<Appointment>> {
        return apiService.put<ApiResponse<Appointment>>(`/appointments/${id}/reschedule`, {
            appointmentDate,
            timeSlot
        });
    }
}

export const appointmentService = new AppointmentService();
export default appointmentService;

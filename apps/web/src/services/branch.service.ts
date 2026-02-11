import apiService from '../lib/api';
import { ApiResponse, Branch } from '../lib/types';

class BranchService {
    async getAllBranches(): Promise<ApiResponse<{ branches: Branch[]; pagination: any }>> {
        return apiService.get<ApiResponse<{ branches: Branch[]; pagination: any }>>('/branches');
    }

    async getBranchById(id: string): Promise<ApiResponse<Branch>> {
        return apiService.get<ApiResponse<Branch>>(`/branches/${id}`);
    }

    async getBranchServices(id: string): Promise<ApiResponse<any[]>> {
        return apiService.get<ApiResponse<any[]>>(`/branches/${id}/services`);
    }

    async getAvailableSlots(branchId: string, date: string, serviceId?: string): Promise<ApiResponse<{
        date: string;
        availableSlots: string[];
        totalSlots: number;
    }>> {
        const params = new URLSearchParams({ date });
        if (serviceId) params.append('serviceId', serviceId);

        return apiService.get<ApiResponse<any>>(
            `/branches/${branchId}/slots?${params.toString()}`
        );
    }
}

export const branchService = new BranchService();
export default branchService;

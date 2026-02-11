import apiService from '../lib/api';
import { ApiResponse, Service, ServiceCategory } from '../lib/types';

class ServiceService {
    async getAllServices(filters?: {
        search?: string;
        categoryId?: string;
        branchId?: string;
        isPopular?: boolean;
    }): Promise<ApiResponse<{ services: Service[]; pagination: any }>> {
        const params = new URLSearchParams();

        if (filters?.search) params.append('search', filters.search);
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.branchId) params.append('branchId', filters.branchId);
        if (filters?.isPopular) params.append('isPopular', 'true');

        return apiService.get<ApiResponse<{ services: Service[]; pagination: any }>>(
            `/services?${params.toString()}`
        );
    }

    async getServiceBySlug(slug: string): Promise<ApiResponse<Service>> {
        return apiService.get<ApiResponse<Service>>(`/services/${slug}`);
    }

    async getCategories(): Promise<ApiResponse<ServiceCategory[]>> {
        return apiService.get<ApiResponse<ServiceCategory[]>>('/services/categories');
    }
}

export const serviceService = new ServiceService();
export default serviceService;

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'PATIENT' | 'ADMIN' | 'SUPER_ADMIN';
    avatar?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Branch {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    openingTime: string;
    closingTime: string;
    isActive: boolean;
    image?: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDesc?: string;
    duration: number;
    price: number;
    discountPrice?: number;
    image?: string;
    benefits: string[];
    isPopular: boolean;
    isActive: boolean;
    categoryId: string;
    category?: ServiceCategory;
    branches?: Array<{ branch: Branch }>;
}

export interface Appointment {
    id: string;
    appointmentDate: string;
    timeSlot: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
    notes?: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    userId?: string;
    serviceId: string;
    branchId: string;
    adminNotes?: string;
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    service?: Service;
    branch?: Branch;
}

export interface Lead {
    id: string;
    name: string;
    email?: string;
    phone: string;
    message?: string;
    serviceInterest?: string;
    source: 'WEBSITE_FORM' | 'CALLBACK_REQUEST' | 'PHONE_INQUIRY' | 'WALK_IN' | 'REFERRAL' | 'SOCIAL_MEDIA';
    status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'LOST';
    assignedTo?: string;
    notes?: string;
    followUpDate?: string;
    userId?: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DashboardStats {
    totalAppointments: number;
    todayAppointments: number;
    weekAppointments: number;
    monthAppointments: number;
    totalPatients: number;
    totalLeads: number;
    newLeads: number;
    estimatedRevenue: number;
    completionRate: number;
    appointmentsByStatus: Array<{ status: string; count: number }>;
    leadsByStatus: Array<{ status: string; count: number }>;
}

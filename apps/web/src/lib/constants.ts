export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
    HOME: '/',
    SERVICES: '/services',
    SERVICE_DETAIL: '/services/:slug',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',

    // Patient routes
    PATIENT_DASHBOARD: '/patient/dashboard',
    PATIENT_BOOK: '/patient/book',
    PATIENT_APPOINTMENTS: '/patient/appointments',
    PATIENT_PROFILE: '/patient/profile',

    // Admin routes
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_APPOINTMENTS: '/admin/appointments',
    ADMIN_LEADS: '/admin/leads',
    ADMIN_PATIENTS: '/admin/patients',
    ADMIN_SERVICES: '/admin/services',
    ADMIN_BRANCHES: '/admin/branches'
} as const;

export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    RESCHEDULED: 'RESCHEDULED',
    NO_SHOW: 'NO_SHOW'
} as const;

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    RESCHEDULED: 'Rescheduled',
    NO_SHOW: 'No Show'
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RESCHEDULED: 'bg-purple-100 text-purple-800',
    NO_SHOW: 'bg-gray-100 text-gray-800'
};

export const LEAD_STATUS = {
    NEW: 'NEW',
    CONTACTED: 'CONTACTED',
    INTERESTED: 'INTERESTED',
    CONVERTED: 'CONVERTED',
    LOST: 'LOST'
} as const;

export const LEAD_STATUS_LABELS: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    INTERESTED: 'Interested',
    CONVERTED: 'Converted',
    LOST: 'Lost'
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    INTERESTED: 'bg-purple-100 text-purple-800',
    CONVERTED: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800'
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
    WEBSITE_FORM: 'Website Form',
    CALLBACK_REQUEST: 'Callback Request',
    PHONE_INQUIRY: 'Phone Inquiry',
    WALK_IN: 'Walk In',
    REFERRAL: 'Referral',
    SOCIAL_MEDIA: 'Social Media'
};

export const USER_ROLES = {
    PATIENT: 'PATIENT',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

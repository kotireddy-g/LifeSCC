export const API_VERSION = '/api';

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
} as const;

export const MESSAGES = {
    SUCCESS: 'Operation successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    PHONE_EXISTS: 'Phone number already registered',
    INVALID_TOKEN: 'Invalid or expired token',
    TOKEN_REQUIRED: 'Authentication token required',
    ADMIN_REQUIRED: 'Admin access required',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error'
} as const;

export const ROLE = {
    PATIENT: 'PATIENT',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    RESCHEDULED: 'RESCHEDULED',
    NO_SHOW: 'NO_SHOW'
} as const;

export const LEAD_STATUS = {
    NEW: 'NEW',
    CONTACTED: 'CONTACTED',
    INTERESTED: 'INTERESTED',
    CONVERTED: 'CONVERTED',
    LOST: 'LOST'
} as const;

export const LEAD_SOURCE = {
    WEBSITE_FORM: 'WEBSITE_FORM',
    CALLBACK_REQUEST: 'CALLBACK_REQUEST',
    PHONE_INQUIRY: 'PHONE_INQUIRY',
    WALK_IN: 'WALK_IN',
    REFERRAL: 'REFERRAL',
    SOCIAL_MEDIA: 'SOCIAL_MEDIA'
} as const;

// Time slot generation
export const SLOT_DURATION = 30; // minutes
export const DEFAULT_OPENING_TIME = '09:00';
export const DEFAULT_CLOSING_TIME = '20:00';

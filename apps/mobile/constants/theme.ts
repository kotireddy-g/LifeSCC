// Theme constants for consistent styling across the app

export const COLORS = {
    // Primary colors
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Background colors
    background: '#FFFFFF',
    backgroundGray: '#F9FAFB',
    backgroundLight: '#F3F4F6',

    // Text colors
    text: '#1F2937',
    textLight: '#6B7280',
    textMuted: '#9CA3AF',

    // Border colors
    border: '#E5E7EB',
    borderDark: '#D1D5DB',

    // Special
    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const FONT_WEIGHTS = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isPatient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        if (authService.isAuthenticated()) {
            try {
                const response = await authService.getProfile();
                if (response.success && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                authService.logout();
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                setUser(response.data.user);
                toast.success('Login successful!');

                // Redirect based on role
                if (response.data.user.role === 'ADMIN' || response.data.user.role === 'SUPER_ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/patient/dashboard');
                }
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await authService.register(data);

            if (response.success && response.data) {
                setUser(response.data.user);
                toast.success('Registration successful!');
                navigate('/patient/dashboard');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
            throw error;
        }
    };

    const updateProfile = async (data: any) => {
        try {
            const response = await authService.updateProfile(data);

            if (response.success && response.data) {
                setUser(response.data);
                toast.success('Profile updated successfully');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        isPatient: user?.role === 'PATIENT'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

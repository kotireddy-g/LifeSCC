import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isPatient: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = await apiService.getToken();
            if (token) {
                const response = await apiService.getProfile();
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await apiService.clearToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login(email, password);
            setUser(response.data.user);
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const register = async (userData: any) => {
        try {
            await apiService.register(userData);
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
            await apiService.clearToken();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            // Clear user even if API call fails
            await apiService.clearToken();
            setUser(null);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        isPatient: user?.role === 'PATIENT',
        loading,
        login,
        register,
        logout,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

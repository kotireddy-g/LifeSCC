import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { apiService } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function ProfileTab() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        upcoming: 0
    });

    useEffect(() => {
        fetchAppointmentStats();
    }, []);

    const fetchAppointmentStats = async () => {
        try {
            const response = await apiService.getMyAppointments();
            const appointments = response.data || [];
            setStats({
                total: appointments.length,
                completed: appointments.filter((a: any) => a.status === 'COMPLETED').length,
                upcoming: appointments.filter((a: any) => a.status === 'CONFIRMED' || a.status === 'PENDING').length
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    if (!user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const displayStats = [
        { label: 'Total Appointments', value: stats.total.toString() },
        { label: 'Completed', value: stats.completed.toString() },
        { label: 'Upcoming', value: stats.upcoming.toString() }
    ];

    const menuItems = [
        { icon: 'person-outline', label: 'Personal Information', action: 'edit-profile' },
        { icon: 'notifications-outline', label: 'Notifications', action: 'notifications' },
        { icon: 'heart-outline', label: 'Favorites', action: 'favorites' },
        { icon: 'document-text-outline', label: 'Appointment History', action: 'history' },
        { icon: 'card-outline', label: 'Payment Methods', action: 'payments' },
        { icon: 'location-outline', label: 'Clinic Locations', action: 'locations' },
        { icon: 'help-circle-outline', label: 'Help & Support', action: 'support' },
        { icon: 'settings-outline', label: 'Settings', action: 'settings' }
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </Text>
                </View>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.phone}>{user.phone || 'No phone number'}</Text>
                <View style={styles.memberBadge}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.memberText}>Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsSection}>
                {displayStats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text style={styles.logoutText}>{loading ? 'Logging out...' : 'Logout'}</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGray
    },
    header: {
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4
    },
    email: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4
    },
    phone: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.backgroundLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    memberText: {
        fontSize: 12,
        color: COLORS.textLight
    },
    statsSection: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 16,
        gap: 12
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: COLORS.backgroundGray,
        borderRadius: 8
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textLight,
        textAlign: 'center'
    },
    menuSection: {
        backgroundColor: COLORS.white,
        marginTop: 12,
        paddingHorizontal: 20
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.backgroundLight
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fee2e2',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        borderRadius: 8
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: '600'
    },
    version: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 24,
        marginBottom: 32
    }
});

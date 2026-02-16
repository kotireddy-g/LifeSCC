import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { apiService } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface Appointment {
    id: string;
    service: { name: string };
    branch: { name: string };
    appointmentDate: string;
    timeSlot: string;
    status: string;
}

export default function HomeTab() {
    const router = useRouter();
    const { user, isAdmin } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
        services: '15+'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await apiService.getMyAppointments();
            const appointmentsData = response.data?.data || response.data || [];
            const appointmentsList = Array.isArray(appointmentsData) ? appointmentsData : [];

            setAppointments(appointmentsList);

            // Calculate stats
            const now = new Date();
            setStats({
                total: appointmentsList.length,
                upcoming: appointmentsList.filter((a: Appointment) =>
                    new Date(a.appointmentDate) >= now && a.status !== 'CANCELLED'
                ).length,
                completed: appointmentsList.filter((a: Appointment) => a.status === 'COMPLETED').length,
                services: '15+'
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Admin stats and actions
    const adminStatsDisplay = [
        { label: 'Total Appointments', value: stats.total.toString(), icon: 'calendar-outline', color: COLORS.primary },
        { label: 'Pending', value: stats.upcoming.toString(), icon: 'time-outline', color: COLORS.warning },
        { label: 'Completed', value: stats.completed.toString(), icon: 'checkmark-circle-outline', color: COLORS.success },
        { label: 'Patients', value: '0', icon: 'people-outline', color: COLORS.info }
    ];

    const adminQuickActions = [
        { title: 'Manage Appointments', icon: 'calendar', route: '/(tabs)/appointments' },
        { title: 'View Services', icon: 'grid', route: '/(tabs)/services' },
        { title: 'Settings', icon: 'settings', route: '/(tabs)/profile' },
        { title: 'Reports', icon: 'stats-chart', route: '/(tabs)/profile' }
    ];

    // Patient stats and actions
    const patientStatsDisplay = [
        { label: 'Total Appointments', value: stats.total.toString(), icon: 'calendar-outline', color: COLORS.primary },
        { label: 'Upcoming', value: stats.upcoming.toString(), icon: 'time-outline', color: COLORS.info },
        { label: 'Completed', value: stats.completed.toString(), icon: 'checkmark-circle-outline', color: COLORS.success },
        { label: 'Services', value: stats.services, icon: 'medical-outline', color: COLORS.warning }
    ];

    const patientQuickActions = [
        { title: 'Book Appointment', icon: 'calendar', route: '/book' },
        { title: 'My Appointments', icon: 'list', route: '/(tabs)/appointments' },
        { title: 'Browse Services', icon: 'grid', route: '/(tabs)/services' },
        { title: 'My Profile', icon: 'person', route: '/(tabs)/profile' }
    ];

    const statsDisplay = isAdmin ? adminStatsDisplay : patientStatsDisplay;
    const quickActions = isAdmin ? adminQuickActions : patientQuickActions;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'CANCELLED')
        .slice(0, 3);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header with Logo */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://www.lifescc.com/img/main-logo1.png' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.userInfo}>
                    <Text style={styles.greeting}>Welcome back{isAdmin ? ', Admin' : ''}!</Text>
                    <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {statsDisplay.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionCard}
                            onPress={() => router.push(action.route as any)}
                        >
                            <View style={styles.actionIconContainer}>
                                <Ionicons name={action.icon as any} size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Upcoming Appointments */}
            {!isAdmin && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>

                    {upcomingAppointments.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
                            </View>
                            <Text style={styles.emptyText}>No upcoming appointments</Text>
                            <TouchableOpacity
                                style={styles.bookButton}
                                onPress={() => router.push('/book')}
                            >
                                <Text style={styles.bookButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        upcomingAppointments.map((appointment) => (
                            <View key={appointment.id} style={styles.appointmentCard}>
                                <View style={styles.appointmentHeader}>
                                    <Text style={styles.serviceName}>{appointment.service.name}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        appointment.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusPending
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            appointment.status === 'CONFIRMED' ? styles.statusConfirmedText : styles.statusPendingText
                                        ]}>{appointment.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.appointmentDetail}>
                                    <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                                    <Text style={styles.detailText}>{appointment.branch.name}</Text>
                                </View>
                                <View style={styles.appointmentDetail}>
                                    <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} />
                                    <Text style={styles.detailText}>
                                        {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            )}

            {/* Admin-specific section */}
            {isAdmin && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Dashboard</Text>
                    <View style={styles.adminInfoCard}>
                        <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
                        <Text style={styles.adminInfoTitle}>Admin Access</Text>
                        <Text style={styles.adminInfoText}>
                            You have administrative privileges. Use the tabs below to manage appointments, services, and view all system data.
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGray
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 60,
        paddingBottom: 30
    },
    logo: {
        width: 120,
        height: 40,
        marginBottom: 16
    },
    userInfo: {
        marginTop: 8
    },
    greeting: {
        fontSize: 14,
        color: COLORS.primaryLight,
        marginBottom: 4
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center'
    },
    section: {
        padding: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    seeAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600'
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    actionCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center'
    },
    appointmentCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    statusConfirmed: {
        backgroundColor: '#D1FAE5'
    },
    statusPending: {
        backgroundColor: '#FEF3C7'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600'
    },
    statusConfirmedText: {
        color: '#065F46'
    },
    statusPendingText: {
        color: '#92400E'
    },
    appointmentDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8
    },
    detailText: {
        fontSize: 14,
        color: COLORS.textLight
    },
    emptyState: {
        backgroundColor: COLORS.white,
        padding: 32,
        borderRadius: 12,
        alignItems: 'center'
    },
    emptyIconContainer: {
        marginBottom: 12
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 16
    },
    bookButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    bookButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600'
    },
    adminInfoCard: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    adminInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 12,
        marginBottom: 8
    },
    adminInfoText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20
    }
});

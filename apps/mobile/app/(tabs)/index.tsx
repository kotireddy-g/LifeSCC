import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { apiService } from '../../lib/api';

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
    const { user } = useAuth();
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

    const statsDisplay = [
        { label: 'Total Appointments', value: stats.total.toString(), icon: '📅' },
        { label: 'Upcoming', value: stats.upcoming.toString(), icon: '🔔' },
        { label: 'Completed', value: stats.completed.toString(), icon: '✅' },
        { label: 'Services', value: stats.services, icon: '💆' }
    ];

    const quickActions = [
        { title: 'Book Appointment', icon: '📅', color: '#8B5CF6', route: '/book' },
        { title: 'My Appointments', icon: '📋', color: '#EC4899', route: '/(tabs)/appointments' },
        { title: 'Browse Services', icon: '✨', color: '#06B6D4', route: '/(tabs)/services' },
        { title: 'My Profile', icon: '👤', color: '#10B981', route: '/(tabs)/profile' }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'CANCELLED')
        .slice(0, 3);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back! 👋</Text>
                    <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {statsDisplay.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
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
                            style={[styles.actionCard, { backgroundColor: action.color }]}
                            onPress={() => router.push(action.route as any)}
                        >
                            <Text style={styles.actionIcon}>{action.icon}</Text>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Upcoming Appointments */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
                        <Text style={styles.seeAll}>See All →</Text>
                    </TouchableOpacity>
                </View>

                {upcomingAppointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
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
                                    <Text style={styles.statusText}>{appointment.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.branchName}>📍 {appointment.branch.name}</Text>
                            <Text style={styles.dateTime}>
                                📅 {formatDate(appointment.appointmentDate)} at {appointment.timeSlot}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },
    header: {
        backgroundColor: '#8B5CF6',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 30
    },
    greeting: {
        fontSize: 16,
        color: '#E9D5FF',
        marginBottom: 4
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
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
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center'
    },
    section: {
        padding: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
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
        color: '#8B5CF6',
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
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center'
    },
    appointmentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
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
        fontWeight: '600',
        color: '#065F46'
    },
    branchName: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4
    },
    dateTime: {
        fontSize: 14,
        color: '#6B7280'
    },
    emptyState: {
        backgroundColor: 'white',
        padding: 32,
        borderRadius: 12,
        alignItems: 'center'
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 16
    },
    bookButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
});

import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface Appointment {
    id: string;
    service: { name: string };
    branch: { name: string; city: string };
    appointmentDate: string;
    timeSlot: string;
    totalPrice: number;
    status: string;
}

export default function AppointmentsTab() {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filters = ['All', 'Upcoming', 'Past', 'Cancelled'];

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setError(null);
            const response = await apiService.getMyAppointments();
            // API returns { success: true, data: [...] }
            // Extract the data array properly
            const appointmentsData = response.data?.data || response.data || [];
            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        } catch (err: any) {
            setError(err.message || 'Failed to load appointments');
            setAppointments([]); // Set empty array on error
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
    };

    const handleCancelAppointment = (id: string) => {
        Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this appointment?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiService.cancelAppointment(id, 'User requested cancellation');
                            Alert.alert('Success', 'Appointment cancelled successfully');
                            fetchAppointments();
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to cancel appointment');
                        }
                    }
                }
            ]
        );
    };

    const filteredAppointments = appointments.filter(apt => {
        const isPast = new Date(apt.appointmentDate) < new Date();
        if (selectedFilter === 'All') return true;
        if (selectedFilter === 'Upcoming') return !isPast && apt.status !== 'CANCELLED';
        if (selectedFilter === 'Past') return isPast && apt.status !== 'CANCELLED';
        if (selectedFilter === 'Cancelled') return apt.status === 'CANCELLED';
        return true;
    });

    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED': return styles.statusConfirmed;
            case 'PENDING': return styles.statusPending;
            case 'COMPLETED': return styles.statusCompleted;
            case 'CANCELLED': return styles.statusCancelled;
            default: return styles.statusPending;
        }
    };

    const formatPrice = (price: number | undefined) => {
        return `₹${(price || 0).toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 16, color: COLORS.textLight }}>Loading appointments...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16, marginBottom: 8 }}>Failed to Load Appointments</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 }}>{error}</Text>
                <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                    onPress={fetchAppointments}
                >
                    <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterChip,
                            selectedFilter === filter && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text style={[
                            styles.filterText,
                            selectedFilter === filter && styles.filterTextActive
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Appointments List */}
            <ScrollView
                style={styles.appointmentsList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {filteredAppointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color={COLORS.textMuted} />
                        <Text style={styles.emptyTitle}>No appointments found</Text>
                        <Text style={styles.emptyText}>
                            {selectedFilter === 'All'
                                ? "You haven't booked any appointments yet"
                                : `No ${selectedFilter.toLowerCase()} appointments`}
                        </Text>
                    </View>
                ) : (
                    filteredAppointments.map((apt) => (
                        <View key={apt.id} style={styles.appointmentCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.serviceName}>{apt.service.name}</Text>
                                <View style={[styles.statusBadge, getStatusStyle(apt.status)]}>
                                    <Text style={styles.statusText}>{apt.status}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={16} color={COLORS.textLight} style={styles.detailIcon} />
                                <Text style={styles.detailText}>{apt.branch.name}, {apt.branch.city}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="calendar-outline" size={16} color={COLORS.textLight} style={styles.detailIcon} />
                                <Text style={styles.detailText}>{formatDate(apt.appointmentDate)} at {apt.timeSlot}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="cash-outline" size={16} color={COLORS.primary} style={styles.detailIcon} />
                                <Text style={styles.priceText}>{formatPrice(apt.totalPrice)}</Text>
                            </View>

                            {/* Actions */}
                            {apt.status === 'CONFIRMED' || apt.status === 'PENDING' ? (
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.actionButtonSecondary}>
                                        <Ionicons name="time-outline" size={16} color={COLORS.text} />
                                        <Text style={styles.actionButtonSecondaryText}>Reschedule</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionButtonDanger}
                                        onPress={() => handleCancelAppointment(apt.id)}
                                    >
                                        <Ionicons name="close-circle-outline" size={16} color={COLORS.error} />
                                        <Text style={styles.actionButtonDangerText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Summary Stats */}
            {filteredAppointments.length > 0 && (
                <View style={styles.summary}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{appointments.length}</Text>
                        <Text style={styles.summaryLabel}>Total</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>
                            {appointments.filter(a => new Date(a.appointmentDate) >= new Date() && a.status !== 'CANCELLED').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Upcoming</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>
                            {appointments.filter(a => a.status === 'COMPLETED').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Completed</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGray
    },
    filters: {
        flexGrow: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 36,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundLight,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterChipActive: {
        backgroundColor: COLORS.primary
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight
    },
    filterTextActive: {
        color: COLORS.white
    },
    appointmentsList: {
        flex: 1,
        padding: 16
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center'
    },
    appointmentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    },
    statusConfirmed: {
        backgroundColor: '#dbeafe'
    },
    statusPending: {
        backgroundColor: '#fef3c7'
    },
    statusCompleted: {
        backgroundColor: '#dcfce7'
    },
    statusCancelled: {
        backgroundColor: '#fee2e2'
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.text
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    detailIcon: {
        marginRight: 8,
        width: 24
    },
    detailText: {
        fontSize: 14,
        color: COLORS.textLight,
        flex: 1
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border
    },
    actionButtonSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.borderDark
    },
    actionButtonSecondaryText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600'
    },
    actionButtonDanger: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fee2e2'
    },
    actionButtonDangerText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '600'
    },
    summary: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: 12
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center'
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4
    },
    summaryLabel: {
        fontSize: 12,
        color: COLORS.textLight
    }
});

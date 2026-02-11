import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AppointmentsTab() {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', 'Upcoming', 'Past', 'Cancelled'];

    const appointments = [
        {
            id: '1',
            service: 'Weight Loss Program',
            branch: 'Jubilee Hills, Hyderabad',
            date: 'Feb 15, 2026',
            time: '10:00 AM',
            price: 12000,
            status: 'Confirmed',
            isPast: false
        },
        {
            id: '2',
            service: 'Skin Rejuvenation',
            branch: 'Banjara Hills, Hyderabad',
            date: 'Feb 18, 2026',
            time: '2:30 PM',
            price: 8000,
            status: 'Pending',
            isPast: false
        },
        {
            id: '3',
            service: 'Hair Restoration',
            branch: 'Kukatpally, Hyderabad',
            date: 'Jan 10, 2026',
            time: '11:00 AM',
            price: 18000,
            status: 'Completed',
            isPast: true
        },
        {
            id: '4',
            service: 'Laser Hair Removal',
            branch: 'MVP Colony, Vizag',
            date: 'Dec 20, 2025',
            time: '3:00 PM',
            price: 5000,
            status: 'Cancelled',
            isPast: true
        }
    ];

    const filteredAppointments = appointments.filter(apt => {
        if (selectedFilter === 'All') return true;
        if (selectedFilter === 'Upcoming') return !apt.isPast && apt.status !== 'Cancelled';
        if (selectedFilter === 'Past') return apt.isPast && apt.status !== 'Cancelled';
        if (selectedFilter === 'Cancelled') return apt.status === 'Cancelled';
        return true;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Confirmed': return styles.statusConfirmed;
            case 'Pending': return styles.statusPending;
            case 'Completed': return styles.statusCompleted;
            case 'Cancelled': return styles.statusCancelled;
            default: return styles.statusPending;
        }
    };

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

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
            <ScrollView style={styles.appointmentsList} showsVerticalScrollIndicator={false}>
                {filteredAppointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
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
                                <Text style={styles.serviceName}>{apt.service}</Text>
                                <View style={[styles.statusBadge, getStatusStyle(apt.status)]}>
                                    <Text style={styles.statusText}>{apt.status}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}>📍</Text>
                                <Text style={styles.detailText}>{apt.branch}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}>📅</Text>
                                <Text style={styles.detailText}>{apt.date} at {apt.time}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}>💰</Text>
                                <Text style={styles.priceText}>{formatPrice(apt.price)}</Text>
                            </View>

                            {/* Actions */}
                            {apt.status === 'Confirmed' || apt.status === 'Pending' ? (
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.actionButtonSecondary}>
                                        <Text style={styles.actionButtonSecondaryText}>Reschedule</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButtonDanger}>
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
                            {appointments.filter(a => !a.isPast && a.status !== 'Cancelled').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Upcoming</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>
                            {appointments.filter(a => a.status === 'Completed').length}
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
        backgroundColor: '#f9fafb'
    },
    filters: {
        flexGrow: 0,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8
    },
    filterChipActive: {
        backgroundColor: '#8B5CF6'
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280'
    },
    filterTextActive: {
        color: 'white'
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
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center'
    },
    appointmentCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
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
        color: '#1f2937',
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
        color: '#1f2937'
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    detailIcon: {
        fontSize: 16,
        marginRight: 8,
        width: 24
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B5CF6'
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb'
    },
    actionButtonSecondary: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        alignItems: 'center'
    },
    actionButtonSecondaryText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600'
    },
    actionButtonDanger: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fee2e2',
        alignItems: 'center'
    },
    actionButtonDangerText: {
        color: '#dc2626',
        fontSize: 14,
        fontWeight: '600'
    },
    summary: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        gap: 12
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center'
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4
    },
    summaryLabel: {
        fontSize: 12,
        color: '#6b7280'
    }
});

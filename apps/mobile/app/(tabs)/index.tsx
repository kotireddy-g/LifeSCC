import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeTab() {
    const router = useRouter();

    const stats = [
        { label: 'Total Appointments', value: '24', icon: '📅' },
        { label: 'Upcoming', value: '3', icon: '🔔' },
        { label: 'Completed', value: '18', icon: '✅' },
        { label: 'Services', value: '15+', icon: '💆' }
    ];

    const quickActions = [
        { title: 'Book Appointment', icon: '📅', color: '#8B5CF6', route: '/book' },
        { title: 'My Appointments', icon: '📋', color: '#EC4899', route: '/(tabs)/appointments' },
        { title: 'Browse Services', icon: '✨', color: '#06B6D4', route: '/(tabs)/services' },
        { title: 'My Profile', icon: '👤', color: '#10B981', route: '/(tabs)/profile' }
    ];

    const upcomingAppointments = [
        {
            id: '1',
            service: 'Weight Loss Program',
            branch: 'Jubilee Hills',
            date: 'Feb 15, 2026',
            time: '10:00 AM',
            status: 'Confirmed'
        },
        {
            id: '2',
            service: 'Skin Rejuvenation',
            branch: 'Banjara Hills',
            date: 'Feb 18, 2026',
            time: '2:30 PM',
            status: 'Pending'
        }
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back! 👋</Text>
                    <Text style={styles.name}>Ananya Reddy</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
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
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {upcomingAppointments.map((apt) => (
                    <View key={apt.id} style={styles.appointmentCard}>
                        <View style={styles.appointmentHeader}>
                            <Text style={styles.appointmentService}>{apt.service}</Text>
                            <View style={[styles.statusBadge, apt.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending]}>
                                <Text style={styles.statusText}>{apt.status}</Text>
                            </View>
                        </View>
                        <Text style={styles.appointmentDetail}>📍 {apt.branch}</Text>
                        <Text style={styles.appointmentDetail}>📅 {apt.date} at {apt.time}</Text>
                    </View>
                ))}
            </View>

            {/* Service Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore Services</Text>
                <View style={styles.categoriesGrid}>
                    {['Weight Loss', 'Skin Care', 'Hair Care'].map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.categoryCard}
                            onPress={() => router.push('/(tabs)/services')}
                        >
                            <Text style={styles.categoryIcon}>
                                {index === 0 ? '⚖️' : index === 1 ? '✨' : '💇'}
                            </Text>
                            <Text style={styles.categoryName}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white'
    },
    greeting: {
        fontSize: 16,
        color: '#6b7280'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 4
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center'
    },
    section: {
        padding: 20,
        paddingTop: 12
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16
    },
    seeAll: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '600'
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    actionCard: {
        flex: 1,
        minWidth: '47%',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center'
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    actionTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },
    appointmentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8
    },
    appointmentService: {
        fontSize: 16,
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
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1f2937'
    },
    appointmentDetail: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4
    },
    categoriesGrid: {
        flexDirection: 'row',
        gap: 12
    },
    categoryCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center'
    }
});

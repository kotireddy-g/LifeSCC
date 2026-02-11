import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileTab() {
    const user = {
        name: 'Ananya Reddy',
        email: 'ananya.reddy@gmail.com',
        phone: '+91 98765 43210',
        memberSince: 'Jan 2026'
    };

    const stats = [
        { label: 'Total Appointments', value: '24' },
        { label: 'Completed', value: '18' },
        { label: 'Upcoming', value: '3' }
    ];

    const menuItems = [
        { icon: '👤', label: 'Personal Information', action: 'edit-profile' },
        { icon: '🔔', label: 'Notifications', action: 'notifications' },
        { icon: '❤️', label: 'Favorites', action: 'favorites' },
        { icon: '📋', label: 'Appointment History', action: 'history' },
        { icon: '💳', label: 'Payment Methods', action: 'payments' },
        { icon: '📍', label: 'Clinic Locations', action: 'locations' },
        { icon: '❓', label: 'Help & Support', action: 'support' },
        { icon: '⚙️', label: 'Settings', action: 'settings' }
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>AR</Text>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.phone}>{user.phone}</Text>
                <View style={styles.memberBadge}>
                    <Text style={styles.memberText}>Member since {user.memberSince}</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsSection}>
                {stats.map((stat, index) => (
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
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb'
    },
    header: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4
    },
    email: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4
    },
    phone: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12
    },
    memberBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    memberText: {
        fontSize: 12,
        color: '#6b7280'
    },
    statsSection: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        gap: 12
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4
    },
    statLabel: {
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center'
    },
    menuSection: {
        backgroundColor: 'white',
        marginTop: 12,
        paddingHorizontal: 20
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6'
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
        width: 32
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937'
    },
    menuArrow: {
        fontSize: 24,
        color: '#9ca3af'
    },
    logoutButton: {
        backgroundColor: '#fee2e2',
        marginHorizontal: 20,
        marginTop: 24,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    logoutText: {
        color: '#dc2626',
        fontSize: 16,
        fontWeight: '600'
    },
    version: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 24,
        marginBottom: 32
    }
});

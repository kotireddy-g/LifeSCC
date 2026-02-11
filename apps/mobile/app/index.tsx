import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.logo}>LifeSCC</Text>
                <Text style={styles.title}>Transform Your Beauty Journey</Text>
                <Text style={styles.subtitle}>
                    World-class non-surgical cosmetic treatments
                </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        Browse Services
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    📍 10+ locations across Telangana & AP
                </Text>
                <Text style={styles.footerText}>
                    ⭐ 50,000+ happy patients
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B5CF6',
        justifyContent: 'space-between',
        padding: 20
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    actions: {
        gap: 12,
        marginBottom: 30
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    primaryButton: {
        backgroundColor: '#EC4899'
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    secondaryButtonText: {
        color: 'white'
    },
    footer: {
        alignItems: 'center',
        gap: 8
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14
    }
});

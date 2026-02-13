import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect to login after a short delay
        const timer = setTimeout(() => {
            router.replace('/login');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>LifeSCC</Text>
            <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 30
    },
    loader: {
        marginBottom: 16
    },
    text: {
        fontSize: 16,
        color: '#6b7280'
    }
});

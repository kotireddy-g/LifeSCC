import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect to login after a short delay
        const timer = setTimeout(() => {
            router.replace('/login');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://www.lifescc.com/img/main-logo1.png' }}
                style={styles.logo}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 200,
        height: 80,
        marginBottom: 30
    },
    loader: {
        marginBottom: 16
    },
    text: {
        fontSize: 16,
        color: COLORS.textLight
    }
});

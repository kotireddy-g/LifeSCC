import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../lib/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            // Navigate to main tabs
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Logo */}
                <View style={styles.logoSection}>
                    <Text style={styles.logo}>LifeSCC</Text>
                    <Text style={styles.subtitle}>Welcome Back</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signupPrompt}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signupLink}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Demo Credentials */}
                <View style={styles.demoBox}>
                    <Text style={styles.demoTitle}>Demo Credentials:</Text>
                    <Text style={styles.demoText}>Admin: admin@lifescc.com / Admin@123</Text>
                    <Text style={styles.demoText}>Patient: ananya.reddy@gmail.com / Admin@123</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center'
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1f2937'
    },
    form: {
        marginBottom: 24
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'white'
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24
    },
    forgotPasswordText: {
        color: '#8B5CF6',
        fontSize: 14
    },
    button: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16
    },
    buttonDisabled: {
        opacity: 0.6
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    signupPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupText: {
        color: '#6b7280',
        fontSize: 14
    },
    signupLink: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '600'
    },
    demoBox: {
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 8,
        marginTop: 20
    },
    demoTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151'
    },
    demoText: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 4
    }
});

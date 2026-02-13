import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: 'MALE',
    });
    const [loading, setLoading] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            // TODO: Integrate with API
            // const response = await authService.register(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert('Registration successful! Please login.');
            router.push('/login');
        } catch (error) {
            alert('Registration failed. Please try again.');
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>LifeSCC</Text>
                    <Text style={styles.subtitle}>Create Account</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>First Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John"
                                value={formData.firstName}
                                onChangeText={(value) => updateField('firstName', value)}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Last Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Doe"
                                value={formData.lastName}
                                onChangeText={(value) => updateField('lastName', value)}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            value={formData.email}
                            onChangeText={(value) => updateField('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChangeText={(value) => updateField('phone', value)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={formData.dateOfBirth}
                            onChangeText={(value) => updateField('dateOfBirth', value)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[styles.genderButton, formData.gender === 'MALE' && styles.genderButtonActive]}
                                onPress={() => updateField('gender', 'MALE')}
                            >
                                <Text style={[styles.genderText, formData.gender === 'MALE' && styles.genderTextActive]}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, formData.gender === 'FEMALE' && styles.genderButtonActive]}
                                onPress={() => updateField('gender', 'FEMALE')}
                            >
                                <Text style={[styles.genderText, formData.gender === 'FEMALE' && styles.genderTextActive]}>Female</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, formData.gender === 'OTHER' && styles.genderButtonActive]}
                                onPress={() => updateField('gender', 'OTHER')}
                            >
                                <Text style={[styles.genderText, formData.gender === 'OTHER' && styles.genderTextActive]}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={formData.password}
                            onChangeText={(value) => updateField('password', value)}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChangeText={(value) => updateField('confirmPassword', value)}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginPrompt}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingTop: 60
    },
    header: {
        alignItems: 'center',
        marginBottom: 32
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1f2937'
    },
    form: {
        marginBottom: 24
    },
    row: {
        flexDirection: 'row'
    },
    inputGroup: {
        marginBottom: 16
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
    genderContainer: {
        flexDirection: 'row',
        gap: 8
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        alignItems: 'center'
    },
    genderButtonActive: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6'
    },
    genderText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500'
    },
    genderTextActive: {
        color: 'white'
    },
    button: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
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
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        color: '#6b7280',
        fontSize: 14
    },
    loginLink: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '600'
    }
});

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { apiService } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

// Types
interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
}

interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
}

export default function BookAppointmentScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchBranches();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await apiService.getServices();
            // API returns { success: true, data: { services: [...], pagination: {...} } }
            const servicesData = response.data?.data?.services || response.data?.services || [];
            setServices(Array.isArray(servicesData) ? servicesData : []);
        } catch (error) {
            console.error('Failed to fetch services:', error);
            Alert.alert('Error', 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await apiService.getBranches();
            // API returns { success: true, data: { branches: [...], pagination: {...} } }
            const branchesData = response.data?.data?.branches || response.data?.branches || [];
            setBranches(Array.isArray(branchesData) ? branchesData : []);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedService || !selectedBranch || !selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please complete all fields');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to book an appointment');
            return;
        }

        try {
            setBooking(true);
            const patientName = `${user.firstName} ${user.lastName}`.trim() || user.email;
            await apiService.createAppointment({
                serviceId: selectedService.id,
                branchId: selectedBranch.id,
                appointmentDate: selectedDate,
                timeSlot: selectedTime,
                patientName: patientName,
                patientPhone: user.phone || '',
                patientEmail: user.email
            });
            Alert.alert('Success', 'Appointment booked successfully!');
            router.push('/(tabs)/appointments');
        } catch (error: any) {
            console.error('Booking error:', error);
            const errorMessage = error.message || error.error || 'Failed to book appointment';
            Alert.alert('Error', errorMessage);
        } finally {
            setBooking(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Book Appointment</Text>
                <Text style={styles.stepIndicator}>Step {step} of 4</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(step / 4) * 100}%` }]} />
            </View>

            <ScrollView style={styles.content}>
                {/* Step 1: Select Service */}
                {step === 1 && (
                    <View>
                        <Text style={styles.stepTitle}>Select Service</Text>
                        {services.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                style={[
                                    styles.card,
                                    selectedService?.id === service.id && styles.cardSelected
                                ]}
                                onPress={() => setSelectedService(service)}
                            >
                                <Text style={styles.cardTitle}>{service.name}</Text>
                                <Text style={styles.cardDesc}>{service.description}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.price}>₹{service.price}</Text>
                                    <Text style={styles.duration}>{service.duration} mins</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Step 2: Select Branch */}
                {step === 2 && (
                    <View>
                        <Text style={styles.stepTitle}>Select Branch</Text>
                        {branches.map((branch) => (
                            <TouchableOpacity
                                key={branch.id}
                                style={[
                                    styles.card,
                                    selectedBranch?.id === branch.id && styles.cardSelected
                                ]}
                                onPress={() => setSelectedBranch(branch)}
                            >
                                <Text style={styles.cardTitle}>{branch.name}</Text>
                                <Text style={styles.cardDesc}>{branch.address}, {branch.city}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Step 3: Select Date */}
                {step === 3 && (
                    <View>
                        <Text style={styles.stepTitle}>Select Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={selectedDate}
                            onChangeText={setSelectedDate}
                        />
                        <Text style={styles.helper}>Enter date in format: 2026-02-15</Text>
                    </View>
                )}

                {/* Step 4: Select Time & Confirm */}
                {step === 4 && (
                    <View>
                        <Text style={styles.stepTitle}>Select Time</Text>
                        <View style={styles.timeGrid}>
                            {timeSlots.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === time && styles.timeSlotSelected
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        selectedTime === time && styles.timeTextSelected
                                    ]}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Summary */}
                        <View style={styles.summary}>
                            <Text style={styles.summaryTitle}>Appointment Summary</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Service:</Text>
                                <Text style={styles.summaryValue}>{selectedService?.name}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Branch:</Text>
                                <Text style={styles.summaryValue}>{selectedBranch?.name}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Date:</Text>
                                <Text style={styles.summaryValue}>{selectedDate}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Time:</Text>
                                <Text style={styles.summaryValue}>{selectedTime}</Text>
                            </View>
                            <View style={[styles.summaryRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' }]}>
                                <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Total:</Text>
                                <Text style={[styles.summaryValue, { fontWeight: '700', color: '#8B5CF6' }]}>₹{selectedService?.price}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.footer}>
                {step > 1 && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.nextButton, step === 1 && { flex: 1 }]}
                    onPress={step === 4 ? handleBookAppointment : handleNext}
                    disabled={
                        (step === 1 && !selectedService) ||
                        (step === 2 && !selectedBranch) ||
                        (step === 3 && !selectedDate) ||
                        (step === 4 && !selectedTime)
                    }
                >
                    <Text style={styles.nextButtonText}>
                        {step === 4 ? 'Confirm Booking' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#8B5CF6'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4
    },
    stepIndicator: {
        fontSize: 14,
        color: '#e9d5ff'
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#e5e7eb'
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#8B5CF6'
    },
    content: {
        flex: 1,
        padding: 16
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1f2937'
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        marginBottom: 12,
        backgroundColor: 'white'
    },
    cardSelected: {
        borderColor: '#8B5CF6',
        backgroundColor: '#f5f3ff'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        color: '#1f2937'
    },
    cardDesc: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#8B5CF6'
    },
    duration: {
        fontSize: 14,
        color: '#6b7280'
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 8
    },
    helper: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic'
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24
    },
    timeSlot: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: 'white'
    },
    timeSlotSelected: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6'
    },
    timeText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500'
    },
    timeTextSelected: {
        color: 'white'
    },
    summary: {
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
        marginTop: 16
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#1f2937'
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b7280'
    },
    summaryValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500'
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: 'white'
    },
    backButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center'
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151'
    },
    nextButton: {
        flex: 2,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#8B5CF6',
        alignItems: 'center'
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white'
    }
});

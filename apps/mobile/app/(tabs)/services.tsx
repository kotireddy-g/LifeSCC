import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { apiService } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface Service {
    id: string;
    name: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    duration: number;
    price: number;
    discountPrice?: number;
    isPopular?: boolean;
    description?: string;
    shortDesc?: string;
    image?: string;
}

export default function ServicesTab() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = ['All', 'Weight Loss', 'Skin Care', 'Hair Care'];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setError(null);
            const response = await apiService.getServices();
            // API returns { success: true, data: { services: [...], pagination: {...} } }
            // Extract the services array from the nested structure
            const servicesData = response.data?.data?.services || response.data?.services || [];
            setServices(Array.isArray(servicesData) ? servicesData : []);
        } catch (err: any) {
            setError(err.message || 'Failed to load services');
            setServices([]); // Set empty array on error
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchServices();
    };

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category?.name === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 16, color: COLORS.textLight }}>Loading services...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16, marginBottom: 8 }}>Failed to Load Services</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 }}>{error}</Text>
                <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                    onPress={fetchServices}
                >
                    <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search services..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.categoryTextActive
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Services List */}
            <ScrollView
                style={styles.servicesList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {filteredServices.map((service) => (
                    <TouchableOpacity key={service.id} style={styles.serviceCard}>
                        <View style={styles.serviceContent}>
                            {/* Service Image */}
                            <View style={styles.imageContainer}>
                                {service.image ? (
                                    <Image
                                        source={{ uri: service.image }}
                                        style={styles.serviceImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Ionicons name="medical-outline" size={32} color={COLORS.primary} />
                                    </View>
                                )}
                            </View>

                            {/* Service Info */}
                            <View style={styles.serviceInfo}>
                                <View style={styles.serviceTitleRow}>
                                    <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
                                    {service.isPopular && (
                                        <View style={styles.popularBadge}>
                                            <Ionicons name="star" size={12} color={COLORS.warning} />
                                            <Text style={styles.popularText}>Popular</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.serviceCategory}>{service.category?.name}</Text>

                                <View style={styles.serviceDetails}>
                                    <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                                    <Text style={styles.detailText}>{service.duration} mins</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    {service.discountPrice ? (
                                        <>
                                            <Text style={styles.originalPrice}>{formatPrice(service.price)}</Text>
                                            <Text style={styles.discountPrice}>{formatPrice(service.discountPrice)}</Text>
                                            <View style={styles.saveBadge}>
                                                <Text style={styles.saveText}>
                                                    Save {Math.round(((service.price - service.discountPrice) / service.price) * 100)}%
                                                </Text>
                                            </View>
                                        </>
                                    ) : (
                                        <Text style={styles.price}>{formatPrice(service.price)}</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.bookButton}
                                    onPress={() => router.push('/book')}
                                >
                                    <Text style={styles.bookButtonText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGray
    },
    searchSection: {
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        paddingHorizontal: 12
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.text
    },
    categories: {
        flexGrow: 0,
        maxHeight: 60,
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 36,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: COLORS.backgroundLight,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text
    },
    categoryTextActive: {
        color: COLORS.white
    },
    servicesList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16
    },
    serviceCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    serviceContent: {
        flexDirection: 'row',
        padding: 12
    },
    imageContainer: {
        width: 80,
        height: 80,
        marginRight: 12
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center'
    },
    serviceInfo: {
        flex: 1
    },
    serviceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1
    },
    popularBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4
    },
    popularText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#92400E'
    },
    serviceCategory: {
        fontSize: 12,
        color: COLORS.primary,
        marginBottom: 6
    },
    serviceDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 4
    },
    detailText: {
        fontSize: 12,
        color: COLORS.textLight
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    originalPrice: {
        fontSize: 14,
        color: COLORS.textMuted,
        textDecorationLine: 'line-through'
    },
    discountPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    saveBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12
    },
    saveText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#065F46'
    },
    bookButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    bookButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600'
    }
});

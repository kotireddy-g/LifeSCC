import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function ServicesTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Weight Loss', 'Skin Care', 'Hair Care'];

    const services = [
        {
            id: '1',
            name: 'Weight Loss Program',
            category: 'Weight Loss',
            duration: 60,
            price: 15000,
            discount: 12000,
            popular: true,
            icon: '⚖️'
        },
        {
            id: '2',
            name: 'Skin Rejuvenation',
            category: 'Skin Care',
            duration: 45,
            price: 8000,
            popular: true,
            icon: '✨'
        },
        {
            id: '3',
            name: 'Hair Restoration',
            category: 'Hair Care',
            duration: 90,
            price: 20000,
            discount: 18000,
            icon: '💇'
        },
        {
            id: '4',
            name: 'Laser Hair Removal',
            category: 'Skin Care',
            duration: 30,
            price: 5000,
            icon: '✨'
        },
        {
            id: '5',
            name: 'Body Contouring',
            category: 'Weight Loss',
            duration: 60,
            price: 12000,
            icon: '⚖️'
        }
    ];

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <View style={styles.container}>
            {/* Search */}
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
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
            <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
                {filteredServices.map((service) => (
                    <TouchableOpacity key={service.id} style={styles.serviceCard}>
                        <View style={styles.serviceHeader}>
                            <Text style={styles.serviceIcon}>{service.icon}</Text>
                            <View style={styles.serviceInfo}>
                                <View style={styles.serviceTitleRow}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                    {service.popular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularText}>⭐ Popular</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.serviceCategory}>{service.category}</Text>

                                <View style={styles.serviceDetails}>
                                    <Text style={styles.detailText}>⏱️ {service.duration} mins</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    {service.discount ? (
                                        <>
                                            <Text style={styles.originalPrice}>{formatPrice(service.price)}</Text>
                                            <Text style={styles.discountPrice}>{formatPrice(service.discount)}</Text>
                                            <View style={styles.saveBadge}>
                                                <Text style={styles.saveText}>
                                                    Save {Math.round(((service.price - service.discount) / service.price) * 100)}%
                                                </Text>
                                            </View>
                                        </>
                                    ) : (
                                        <Text style={styles.price}>{formatPrice(service.price)}</Text>
                                    )}
                                </View>

                                <TouchableOpacity style={styles.bookButton}>
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
        backgroundColor: '#f9fafb'
    },
    searchSection: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    searchInput: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },
    categories: {
        flexGrow: 0,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8
    },
    categoryChipActive: {
        backgroundColor: '#8B5CF6'
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280'
    },
    categoryTextActive: {
        color: 'white'
    },
    servicesList: {
        flex: 1,
        padding: 16
    },
    serviceCard: {
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
    serviceHeader: {
        flexDirection: 'row'
    },
    serviceIcon: {
        fontSize: 40,
        marginRight: 12
    },
    serviceInfo: {
        flex: 1
    },
    serviceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1
    },
    popularBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    popularText: {
        fontSize: 11,
        color: '#92400e'
    },
    serviceCategory: {
        fontSize: 14,
        color: '#8B5CF6',
        marginBottom: 8
    },
    serviceDetails: {
        marginBottom: 8
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280'
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B5CF6'
    },
    originalPrice: {
        fontSize: 14,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
        marginRight: 8
    },
    discountPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginRight: 8
    },
    saveBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    saveText: {
        fontSize: 11,
        color: '#166534',
        fontWeight: '600'
    },
    bookButton: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    bookButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    }
});

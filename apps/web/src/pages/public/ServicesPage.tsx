import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Sparkles, Search, Filter, Clock, ChevronRight, Star,
    TrendingUp, MapPin, Award
} from 'lucide-react';
import serviceService from '@/services/service.service';
import { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [selectedCategory, searchQuery, services]);

    const loadServices = async () => {
        try {
            const response = await serviceService.getAllServices();
            if (response.success && response.data) {
                setServices(response.data.services);
                const validCategories = response.data.services
                    .map(s => s.category?.name)
                    .filter((cat): cat is string => typeof cat === 'string' && cat !== '');
                const uniqueCategories = ['All', ...Array.from(new Set(validCategories))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = services;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(s => s.category?.name === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            'Weight Loss': '⚖️',
            'Skin Care': '✨',
            'Hair Care': '💇',
            'All': '🌟'
        };
        return icons[category] || '💎';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Premium Header */}
            <header className="glass sticky top-0 z-50 border-b border-gray-100 shadow-soft">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-violet-600" />
                            <span className="text-2xl font-['Playfair_Display'] font-bold gradient-text">
                                LifeSCC
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                Home
                            </Link>
                            <Link to="/services" className="font-medium text-violet-600">
                                Services
                            </Link>
                            <Link to="/about" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                About
                            </Link>
                            <Link to="/contact" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                Contact
                            </Link>
                            <Link to="/login">
                                <Button className="btn-primary px-6 py-2 rounded-full">
                                    Login
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="gradient-primary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">FDA Approved Treatments</span>
                    </div>

                    <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold mb-6">
                        Our Premium Services
                    </h1>

                    <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                        Discover our comprehensive range of non-surgical cosmetic treatments designed to enhance your natural beauty
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search treatments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 text-lg rounded-full bg-white/95 backdrop-blur-sm border-0 shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12">
                {/* Category Filter */}
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-['Poppins'] text-2xl font-semibold flex items-center gap-2">
                            <Filter className="w-6 h-6 text-violet-600" />
                            Filter by Category
                        </h2>
                        <span className="text-sm text-gray-600">
                            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                  px-6 py-3 rounded-full font-semibold transition-all duration-300
                  flex items-center gap-2 hover:scale-105
                  ${selectedCategory === category
                                        ? 'gradient-primary text-white shadow-premium'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
                                    }
                `}
                            >
                                <span className="text-lg">{getCategoryIcon(category)}</span>
                                <span>{category}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600"></div>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <div
                                key={service.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover-lift animate-fade-in"
                                style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                            >
                                {/* Service Image Placeholder */}
                                <div className="relative h-56 bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 flex items-center justify-center">
                                    <div className="text-6xl">{getCategoryIcon(service.category?.name || '')}</div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-violet-600 rounded-full text-xs font-semibold">
                                        {service.category?.name || 'General'}
                                    </div>

                                    {/* Popular Badge */}
                                    {index < 3 && (
                                        <div className="absolute top-4 right-4 gradient-secondary px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                            <Star className="w-3 h-3 text-white fill-current" />
                                            <span className="text-xs text-white font-semibold">Popular</span>
                                        </div>
                                    )}
                                </div>

                                {/* Service Content */}
                                <div className="p-6">
                                    <h3 className="font-['Poppins'] text-2xl font-semibold mb-3 text-gray-900 group-hover:text-violet-600 transition-colors">
                                        {service.name}
                                    </h3>

                                    {service.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>
                                    )}

                                    {/* Service Meta */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{service.duration} min</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>Safe & Effective</span>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-violet-600">
                                                {formatCurrency(service.price)}
                                            </span>
                                            {service.discountPrice && service.discountPrice < service.price && (
                                                <>
                                                    <span className="text-lg text-gray-400 line-through">
                                                        {formatCurrency(service.discountPrice)}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                                        Save {Math.round(((service.price - service.discountPrice) / service.price) * 100)}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex gap-3">
                                        <Link to={`/services/${service.slug}`} className="flex-1">
                                            <Button variant="outline" className="w-full group">
                                                <span>View Details</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                        <Link to="/patient/book" className="flex-1">
                                            <Button className="w-full btn-primary">
                                                Book Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {filteredServices.length > 0 && (
                    <div className="mt-16 text-center animate-fade-in">
                        <Card className="gradient-primary text-white p-12 rounded-3xl shadow-premium">
                            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4">
                                Not Sure Which Treatment is Right for You?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                Book a free consultation with our certified specialists and get personalized recommendations
                            </p>
                            <Link to="/patient/book">
                                <button className="btn-white text-lg px-12 py-6">
                                    <MapPin className="w-6 h-6" />
                                    <span>Book Free Consultation</span>
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </Link>
                        </Card>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-6 w-6 text-violet-400" />
                        <span className="text-xl font-['Playfair_Display'] font-bold text-white">
                            LifeSCC
                        </span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        India's premier chain of cosmetic clinics
                    </p>
                    <p className="text-gray-500 text-sm">
                        &copy; 2026 LifeSCC. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

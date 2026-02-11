import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import serviceService from '@/services/service.service';
import { Service, ServiceCategory } from '@/lib/types';
import { formatCurrency, debounce } from '@/lib/utils';
import { toast } from 'sonner';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCategories();
        loadServices();
    }, []);

    useEffect(() => {
        const debouncedSearch = debounce(() => loadServices(), 500);
        debouncedSearch();
    }, [selectedCategory, searchQuery]);

    const loadCategories = async () => {
        try {
            const response = await serviceService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadServices = async () => {
        setLoading(true);
        try {
            const response = await serviceService.getAllServices({
                categoryId: selectedCategory || undefined,
                search: searchQuery || undefined
            });

            if (response.success && response.data) {
                setServices(response.data.services);
            }
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold gradient-text">
                            LifeSCC
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="hover:text-primary transition">Home</Link>
                            <Link to="/services" className="text-primary font-medium">Services</Link>
                            <Link to="/about" className="hover:text-primary transition">About</Link>
                            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="gradient-primary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Explore our comprehensive range of non-surgical cosmetic treatments
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <Button
                        variant={selectedCategory === '' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('')}
                    >
                        All Services
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No services found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Card key={service.id} className="hover:shadow-lg transition">
                                {service.image && (
                                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                        <span className="text-4xl">💆</span>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <CardTitle className="text-xl">{service.name}</CardTitle>
                                        {service.isPopular && (
                                            <span className="bg-secondary text-white text-xs px-2 py-1 rounded">Popular</span>
                                        )}
                                    </div>
                                    <CardDescription>{service.shortDesc || service.description.substring(0, 100)}...</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Duration</span>
                                            <span className="font-medium">{service.duration} mins</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Price</span>
                                            <div className="text-right">
                                                {service.discountPrice ? (
                                                    <>
                                                        <span className="line-through text-muted-foreground text-sm">
                                                            {formatCurrency(service.price)}
                                                        </span>
                                                        <span className="ml-2 font-bold text-primary">
                                                            {formatCurrency(service.discountPrice)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-primary">{formatCurrency(service.price)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Link to={`/services/${service.slug}`} className="flex-1">
                                        <Button variant="outline" className="w-full">View Details</Button>
                                    </Link>
                                    <Link to={`/patient/book?serviceId=${service.id}`} className="flex-1">
                                        <Button className="w-full">Book Now</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

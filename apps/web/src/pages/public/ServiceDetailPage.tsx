import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, IndianRupee, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import serviceService from '@/services/service.service';
import { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ServiceDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadService(slug);
        }
    }, [slug]);

    const loadService = async (slug: string) => {
        setLoading(true);
        try {
            const response = await serviceService.getServiceBySlug(slug);
            if (response.success && response.data) {
                setService(response.data);
            }
        } catch (error) {
            toast.error('Service not found');
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!service) {
        return null;
    }

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

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    {' / '}
                    <Link to="/services" className="hover:text-primary">Services</Link>
                    {' / '}
                    <span className="text-foreground">{service.name}</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Service Header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
                                    {service.category && (
                                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                            {service.category.name}
                                        </span>
                                    )}
                                </div>
                                {service.isPopular && (
                                    <span className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        ⭐ Popular
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    <span>{service.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5" />
                                    {service.discountPrice ? (
                                        <>
                                            <span className="line-through">{formatCurrency(service.price)}</span>
                                            <span className="font-bold text-primary">{formatCurrency(service.discountPrice)}</span>
                                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                                Save {Math.round(((service.price - service.discountPrice) / service.price) * 100)}%
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-primary">{formatCurrency(service.price)}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">About This Treatment</h2>
                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                        </div>

                        {/* Benefits */}
                        {service.benefits && service.benefits.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {service.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Branches */}
                        {service.branches && service.branches.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Available At</h2>
                                <div className="grid gap-4">
                                    {service.branches.map((item) => (
                                        <Card key={item.branch.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-primary mt-1" />
                                                    <div>
                                                        <h3 className="font-semibold">{item.branch.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.branch.address}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.branch.city}, {item.branch.state}
                                                        </p>
                                                        <p className="text-sm mt-1">📞 {item.branch.phone}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="mb-6">
                                    <div className="text-3xl font-bold text-primary mb-2">
                                        {service.discountPrice
                                            ? formatCurrency(service.discountPrice)
                                            : formatCurrency(service.price)}
                                    </div>
                                    {service.discountPrice && (
                                        <div className="text-sm text-muted-foreground line-through">
                                            {formatCurrency(service.price)}
                                        </div>
                                    )}
                                </div>

                                <Link to={`/patient/book?serviceId=${service.id}`}>
                                    <Button size="lg" className="w-full mb-3">
                                        Book This Service
                                    </Button>
                                </Link>

                                <Link to="/services">
                                    <Button variant="outline" className="w-full">
                                        Browse More Services
                                    </Button>
                                </Link>

                                <div className="mt-6 pt-6 border-t space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration:</span>
                                        <span className="font-medium">{service.duration} mins</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category:</span>
                                        <span className="font-medium">{service.category?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Available At:</span>
                                        <span className="font-medium">{service.branches?.length || 0} branches</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

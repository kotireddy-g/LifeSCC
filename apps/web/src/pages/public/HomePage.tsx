import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Calendar, Sparkles, MapPin, Award, Users, TrendingUp,
    Star, Clock, ChevronDown, ChevronRight, Heart
} from 'lucide-react';

export default function HomePage() {
    const stats = [
        { icon: Clock, label: 'Years Experience', value: '15+', color: 'violet' },
        { icon: MapPin, label: 'Clinic Locations', value: '10+', color: 'purple' },
        { icon: Users, label: 'Happy Patients', value: '50K+', color: 'pink' },
        { icon: Sparkles, label: 'Treatments Offered', value: '100+', color: 'teal' }
    ];

    const features = [
        {
            icon: Award,
            title: 'FDA Approved Treatments',
            description: 'We use only internationally certified equipment and follow global safety standards for all procedures.',
            color: 'from-violet-500 to-purple-600'
        },
        {
            icon: Users,
            title: 'Expert Specialists',
            description: 'Our certified cosmetic specialists have years of experience in non-surgical aesthetic treatments.',
            color: 'from-rose-500 to-pink-600'
        },
        {
            icon: MapPin,
            title: 'Convenient Locations',
            description: 'Visit any of our 10+ modern clinics across Telangana and Andhra Pradesh.',
            color: 'from-teal-500 to-cyan-600'
        }
    ];

    const popularServices = [
        {
            name: 'Weight Loss Program',
            category: 'Weight Management',
            duration: '60 min',
            price: 15000,
            discountPrice: 12000,
            isPopular: true,
            icon: '⚖️'
        },
        {
            name: 'Skin Rejuvenation',
            category: 'Skin Care',
            duration: '45 min',
            price: 8000,
            isPopular: true,
            icon: '✨'
        },
        {
            name: 'Hair Restoration',
            category: 'Hair Care',
            duration: '90 min',
            price: 20000,
            discountPrice: 18000,
            icon: '💇'
        }
    ];

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
                            <Link to="/" className="font-medium text-violet-600 hover:text-violet-700 transition-colors">
                                Home
                            </Link>
                            <Link to="/services" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                Services
                            </Link>
                            <Link to="/about" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                About
                            </Link>
                            <Link to="/contact" className="font-medium text-gray-700 hover:text-violet-600 transition-colors">
                                Contact
                            </Link>
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" className="font-medium">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="btn-primary px-6 py-2 rounded-full">
                                        Book Now
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Premium Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Content */}
                        <div className="animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-soft">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ Patients</span>
                            </div>

                            <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                Transform Your
                                <span className="gradient-text block">Beauty Journey</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                                Experience world-class non-surgical cosmetic treatments at India's most trusted aesthetic clinic chain.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-12">
                                <Link to="/patient/book">
                                    <button className="btn-white group">
                                        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span>Book Appointment</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link to="/services">
                                    <button className="btn-secondary group">
                                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        <span>Explore Services</span>
                                    </button>
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-violet-600" />
                                    <span className="text-sm text-gray-600">FDA Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-rose-500" />
                                    <span className="text-sm text-gray-600">Safe & Effective</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-teal-600" />
                                    <span className="text-sm text-gray-600">Proven Results</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Visual */}
                        <div className="relative lg:block hidden animate-slide-in-right">
                            <div className="relative">
                                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                                <div className="relative bg-white rounded-3xl p-8 shadow-premium">
                                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <Sparkles className="w-32 h-32 text-violet-600 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-gray-800">Premium Aesthetic Care</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-violet-600 opacity-70" />
                </div>
            </section>

            {/* Premium Stats Bar - Floating */}
            <section className="relative z-20 -mt-24">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-premium p-8 md:p-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`text-center animate-scale-in delay-${(index + 1) * 100}`}
                                >
                                    <div className={`inline-flex p-4 rounded-2xl gradient-${stat.color === 'violet' ? 'primary' : stat.color === 'pink' ? 'secondary' : 'accent'} mb-4`}>
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold mb-4">
                            Why Choose <span className="gradient-text">LifeSCC</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Combining medical expertise with cutting-edge technology to deliver exceptional results
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className={`hover-lift bg-white rounded-2xl border-0 shadow-soft animate-fade-in delay-${(index + 1) * 100}`}
                            >
                                <CardContent className="p-8">
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-['Poppins'] text-2xl font-semibold mb-3 text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Services */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold mb-4">
                            Popular <span className="gradient-text">Treatments</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover our most sought-after cosmetic procedures
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {popularServices.map((service, index) => (
                            <div key={index} className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover-lift">
                                {/* Service Content */}
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-5xl">{service.icon}</div>
                                        {service.isPopular && (
                                            <div className="gradient-secondary px-3 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3 text-white fill-current" />
                                                <span className="text-xs text-white font-semibold">Popular</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3 inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                                        {service.category}
                                    </div>

                                    <h3 className="font-['Poppins'] text-2xl font-semibold mb-3 text-gray-900">
                                        {service.name}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                        <Clock className="w-4 h-4" />
                                        <span>{service.duration}</span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-6">
                                        {service.discountPrice ? (
                                            <>
                                                <span className="text-3xl font-bold text-violet-600">
                                                    ₹{service.discountPrice.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-lg text-gray-400 line-through">
                                                    ₹{service.price.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                    Save {Math.round(((service.price - service.discountPrice) / service.price) * 100)}%
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl font-bold text-violet-600">
                                                ₹{service.price.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>

                                    <Link to={`/services`}>
                                        <Button className="w-full btn-primary">
                                            <span>View Details</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/services">
                            <Button className="btn-secondary text-lg px-10 py-6">
                                View All Services
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 gradient-primary">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold mb-6">
                        Ready to Transform Your Life?
                    </h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Book a free consultation with our experts and discover the perfect treatment plan for you
                    </p>
                    <Link to="/patient/book">
                        <button className="btn-white text-lg px-12 py-6">
                            <Calendar className="w-6 h-6" />
                            <span>Book Free Consultation</span>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </Link>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="h-8 w-8 text-violet-400" />
                                <span className="text-2xl font-['Playfair_Display'] font-bold text-white">
                                    LifeSCC
                                </span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                India's premier chain of cosmetic clinics offering safe, effective, and affordable beauty treatments.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
                                <li><Link to="/services" className="hover:text-violet-400 transition-colors">Services</Link></li>
                                <li><Link to="/contact" className="hover:text-violet-400 transition-colors">Contact</Link></li>
                                <li><Link to="/login" className="hover:text-violet-400 transition-colors">Patient Login</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Services</h4>
                            <ul className="space-y-2">
                                <li className="hover:text-violet-400 transition-colors cursor-pointer">Weight Loss</li>
                                <li className="hover:text-violet-400 transition-colors cursor-pointer">Skin Care</li>
                                <li className="hover:text-violet-400 transition-colors cursor-pointer">Hair Care</li>
                                <li className="hover:text-violet-400 transition-colors cursor-pointer">Body Contouring</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-violet-400" />
                                    <span className="text-sm">Jubilee Hills, Hyderabad</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-violet-400" />
                                    <span className="text-sm">Mon-Sat: 9AM-8PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
                        <p>&copy; 2026 LifeSCC. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

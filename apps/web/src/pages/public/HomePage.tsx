import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Award, MapPin } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold gradient-text">LifeSCC</div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/services" className="hover:text-primary transition">Services</Link>
                            <Link to="/about" className="hover:text-primary transition">About</Link>
                            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="gradient-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Transform Your Beauty Journey
                    </h1>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Experience world-class non-surgical cosmetic treatments at India's leading clinic chain
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/patient/book">
                            <Button size="lg" variant="secondary">
                                Book Appointment
                            </Button>
                        </Link>
                        <Link to="/services">
                            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                Explore Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-muted/50 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">15+</div>
                            <div className="text-muted-foreground">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10+</div>
                            <div className="text-muted-foreground">Clinics</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                            <div className="text-muted-foreground">Happy Patients</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">100+</div>
                            <div className="text-muted-foreground">Treatments</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose LifeSCC?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Expert Doctors',
                                description: 'Certified and experienced cosmetic specialists'
                            },
                            {
                                icon: Award,
                                title: 'Advanced Technology',
                                description: 'Latest FDA-approved equipment and techniques'
                            },
                            {
                                icon: Calendar,
                                title: 'Easy Booking',
                                description: 'Book appointments online at your convenience'
                            },
                            {
                                icon: MapPin,
                                title: '10+ Locations',
                                description: 'Clinics across Telangana and Andhra Pradesh'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="text-center p-6 rounded-lg border hover:shadow-lg transition">
                                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="gradient-primary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transformation?</h2>
                    <p className="text-lg mb-8 opacity-90">Book your consultation today</p>
                    <Link to="/patient/book">
                        <Button size="lg" variant="secondary">
                            Book Appointment
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">LifeSCC</h3>
                            <p className="text-gray-400">Transform your beauty journey with India's leading cosmetic clinic chain</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@lifescc.com</li>
                                <li>Phone: +91 40 4012 3456</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Follow Us</h4>
                            <div className="flex space-x-4 text-gray-400">
                                <a href="#" className="hover:text-white transition">Facebook</a>
                                <a href="#" className="hover:text-white transition">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2026 Life Slimming & Cosmetic Clinic. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, MapPin, Target, Sparkles, Heart, Shield, Calendar } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
            {/* Premium Header with Glass Morphism */}
            <header className="border-b bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-soft">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-['Playfair_Display'] font-bold gradient-text">
                                LifeSCC
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium">
                                Home
                            </Link>
                            <Link to="/services" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium">
                                Services
                            </Link>
                            <Link to="/about" className="text-primary font-semibold">
                                About
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium">
                                Contact
                            </Link>
                            <Link to="/login">
                                <Button className="rounded-full btn-primary">Login</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Premium Hero with Animated Background */}
            <section className="relative py-20 overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-4 text-white">
                        About LifeSCC
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Transforming lives through safe, effective, and affordable cosmetic treatments
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Mission & Vision - Premium Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 -mt-32 relative z-20">
                    <Card className="rounded-2xl shadow-premium border-0 glass hover-lift animate-fade-in">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-['Playfair_Display'] font-bold mb-4 gradient-text">
                                Our Mission
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To provide world-class non-surgical cosmetic treatments that enhance confidence and well-being,
                                making beauty accessible and affordable for everyone across India.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-premium border-0 glass hover-lift animate-fade-in delay-100">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-['Playfair_Display'] font-bold mb-4 gradient-text">
                                Our Vision
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To be India's most trusted cosmetic clinic chain, known for excellence in patient care,
                                innovative treatments, and transformative results.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Our Story - Enhanced */}
                <div className="mb-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4 gradient-text">
                            Our Story
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full"></div>
                    </div>

                    <Card className="rounded-2xl shadow-soft border-0 glass max-w-4xl mx-auto animate-scale-in">
                        <CardContent className="p-10">
                            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                                <p>
                                    Founded in 2008, <span className="font-semibold text-primary">Life Slimming & Cosmetic Clinic (LifeSCC)</span> started with a simple vision:
                                    to make advanced cosmetic treatments accessible to everyone. What began as a single clinic
                                    in Hyderabad has grown into a network of <span className="font-semibold text-primary">10+ clinics</span> across Telangana and Andhra Pradesh.
                                </p>
                                <p>
                                    Over <span className="font-semibold text-primary">15 years</span>, we've served more than <span className="font-semibold text-primary">50,000 satisfied patients</span>, helping them achieve
                                    their beauty and wellness goals through safe, FDA-approved, non-surgical treatments. Our
                                    team of certified specialists uses the latest technology and techniques to deliver
                                    exceptional results.
                                </p>
                                <p>
                                    Today, LifeSCC is recognized as a leader in the cosmetic treatment industry, known for
                                    our commitment to patient safety, personalized care, and outstanding outcomes.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Why Choose Us - Premium Cards */}
                <div className="mb-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4 gradient-text">
                            Why Choose LifeSCC?
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Expert Team',
                                description: 'Certified cosmetic specialists with years of experience in non-surgical treatments',
                                gradient: 'from-violet-500 to-purple-600'
                            },
                            {
                                icon: Shield,
                                title: 'FDA Approved',
                                description: 'We use only FDA-approved equipment and follow international safety standards',
                                gradient: 'from-pink-500 to-rose-600'
                            },
                            {
                                icon: MapPin,
                                title: '10+ Locations',
                                description: 'Convenient clinics across Telangana and Andhra Pradesh for easy access',
                                gradient: 'from-purple-500 to-pink-600'
                            },
                            {
                                icon: Heart,
                                title: 'Patient-Centric',
                                description: 'Personalized treatment plans tailored to your unique needs and goals',
                                gradient: 'from-rose-500 to-pink-600'
                            },
                            {
                                icon: Award,
                                title: 'Proven Results',
                                description: '15+ years of excellence with 50,000+ satisfied patients across India',
                                gradient: 'from-violet-500 to-pink-600'
                            },
                            {
                                icon: Calendar,
                                title: 'Flexible Scheduling',
                                description: 'Extended hours and easy online booking to fit your busy lifestyle',
                                gradient: 'from-purple-500 to-rose-600'
                            }
                        ].map((item, idx) => (
                            <Card
                                key={idx}
                                className="rounded-2xl shadow-soft border-0 glass hover-lift animate-fade-in"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <CardContent className="p-8 text-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                                        <item.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-['Playfair_Display'] font-bold mb-3 text-gray-900">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Our Clinics - Enhanced */}
                <div className="mb-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4 gradient-text">
                            Our Clinics
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-pink-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'Kukatpally', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'MVP Colony', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
                            { name: 'MG Road', city: 'Vijayawada', state: 'Andhra Pradesh' },
                            { name: 'Madhapur', city: 'Hyderabad', state: 'Telangana' }
                        ].map((branch, idx) => (
                            <Card
                                key={idx}
                                className="rounded-2xl shadow-soft border-0 glass hover-scale animate-fade-in"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-['Playfair_Display'] font-bold text-lg mb-1 text-gray-900">
                                                {branch.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {branch.city}, {branch.state}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Premium CTA Section */}
                <div className="text-center">
                    <Card className="rounded-3xl shadow-premium border-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 overflow-hidden animate-scale-in">
                        <CardContent className="p-12 relative">
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-4 text-white">
                                    Ready to Transform Your Life?
                                </h2>
                                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                    Book a consultation with our experts today and start your journey to confidence
                                </p>
                                <Link to="/patient/book">
                                    <Button size="lg" className="btn-white hover:scale-105 transition-all duration-300">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Book Appointment
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

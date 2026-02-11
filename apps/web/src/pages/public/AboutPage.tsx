import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, MapPin, Target } from 'lucide-react';

export default function AboutPage() {
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
                            <Link to="/services" className="hover:text-primary transition">Services</Link>
                            <Link to="/about" className="text-primary font-medium">About</Link>
                            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="gradient-primary text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About LifeSCC</h1>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        Transforming lives through safe, effective, and affordable cosmetic treatments
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card>
                        <CardContent className="p-8">
                            <Target className="h-12 w-12 text-primary mb-4" />
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To provide world-class non-surgical cosmetic treatments that enhance confidence and well-being,
                                making beauty accessible and affordable for everyone across India.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-8">
                            <Award className="h-12 w-12 text-primary mb-4" />
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To be India's most trusted cosmetic clinic chain, known for excellence in patient care,
                                innovative treatments, and transformative results.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Our Story */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                    <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Founded in 2008, Life Slimming & Cosmetic Clinic (LifeSCC) started with a simple vision:
                            to make advanced cosmetic treatments accessible to everyone. What began as a single clinic
                            in Hyderabad has grown into a network of 10+ clinics across Telangana and Andhra Pradesh.
                        </p>
                        <p>
                            Over 15 years, we've served more than 50,000 satisfied patients, helping them achieve
                            their beauty and wellness goals through safe, FDA-approved, non-surgical treatments. Our
                            team of certified specialists uses the latest technology and techniques to deliver
                            exceptional results.
                        </p>
                        <p>
                            Today, LifeSCC is recognized as a leader in the cosmetic treatment industry, known for
                            our commitment to patient safety, personalized care, and outstanding outcomes.
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Why Choose LifeSCC?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Users,
                                title: 'Expert Team',
                                description: 'Certified cosmetic specialists with years of experience in non-surgical treatments'
                            },
                            {
                                icon: Award,
                                title: 'FDA Approved',
                                description: 'We use only FDA-approved equipment and follow international safety standards'
                            },
                            {
                                icon: MapPin,
                                title: '10+ Locations',
                                description: 'Convenient clinics across Telangana and Andhra Pradesh for easy access'
                            }
                        ].map((item, idx) => (
                            <Card key={idx} className="text-center hover:shadow-lg transition">
                                <CardContent className="p-6">
                                    <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Our Branches */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Clinics</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'Kukatpally', city: 'Hyderabad', state: 'Telangana' },
                            { name: 'MVP Colony', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
                            { name: 'MG Road', city: 'Vijayawada', state: 'Andhra Pradesh' }
                        ].map((branch, idx) => (
                            <Card key={idx}>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {branch.city}, {branch.state}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
                    <p className="text-muted-foreground mb-6">
                        Book a consultation with our experts today
                    </p>
                    <Link to="/patient/book">
                        <Button size="lg">Book Appointment</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

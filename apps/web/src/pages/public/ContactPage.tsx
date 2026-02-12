import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema)
    });

    const onSubmit = async (data: ContactForm) => {
        setIsSubmitting(true);
        try {
            // In a real app, this would call the API
            // await apiService.post('/leads/contact', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <Link to="/about" className="text-gray-700 hover:text-primary transition-all duration-300 font-medium">
                                About
                            </Link>
                            <Link to="/contact" className="text-primary font-semibold">
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
                        Contact Us
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-8 -mt-32 relative z-20">
                    {/* Premium Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl shadow-premium border-0 glass animate-fade-in">
                            <CardHeader className="pb-6">
                                <CardTitle className="text-3xl font-['Playfair_Display'] gradient-text">
                                    Send Us a Message
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600">
                                    Fill out the form below and we'll get back to you within 24 hours
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            {...register('name')}
                                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                {...register('email')}
                                                className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-destructive">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                {...register('phone')}
                                                className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary"
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                                            Subject *
                                        </Label>
                                        <Input
                                            id="subject"
                                            placeholder="What is this regarding?"
                                            {...register('subject')}
                                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary"
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-destructive">{errors.subject.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                                            Message *
                                        </Label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            placeholder="Tell us more about your inquiry..."
                                            {...register('message')}
                                            className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full md:w-auto"
                                    >
                                        <Send className="h-5 w-5 mr-2" />
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Premium Contact Info Cards */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl shadow-soft border-0 glass hover-lift animate-fade-in delay-100">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-md">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-['Playfair_Display'] font-bold text-lg mb-3 text-gray-900">
                                    Phone
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-gray-600">+91 40 4012 3456</p>
                                    <p className="text-gray-600">+91 98765 43210</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-soft border-0 glass hover-lift animate-fade-in delay-200">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 shadow-md">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-['Playfair_Display'] font-bold text-lg mb-3 text-gray-900">
                                    Email
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-gray-600">info@lifescc.com</p>
                                    <p className="text-gray-600">support@lifescc.com</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-soft border-0 glass hover-lift animate-fade-in delay-300">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-md">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-['Playfair_Display'] font-bold text-lg mb-3 text-gray-900">
                                    Business Hours
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Monday - Saturday</p>
                                    <p className="font-medium text-gray-900">9:00 AM - 8:00 PM</p>
                                    <p className="mt-2">Sunday</p>
                                    <p className="font-medium text-gray-900">10:00 AM - 6:00 PM</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-soft border-0 glass hover-lift animate-fade-in delay-400">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 shadow-md">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-['Playfair_Display'] font-bold text-lg mb-3 text-gray-900">
                                    Head Office
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Road No. 36, Jubilee Hills<br />
                                    Hyderabad, Telangana 500033<br />
                                    India
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

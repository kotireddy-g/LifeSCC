import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Clock, User, LogOut, Sparkles,
    Heart, Award, ChevronRight, Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import appointmentService from '@/services/appointment.service';
import { Appointment } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from '@/lib/constants';

export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingCount: 0,
        completedCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getMyAppointments();
            if (response.success && response.data) {
                const appointments = response.data;
                const now = new Date();

                // Calculate stats
                const upcoming = appointments.filter(apt =>
                    new Date(apt.appointmentDate) >= now &&
                    (apt.status === 'PENDING' || apt.status === 'CONFIRMED')
                );
                const completed = appointments.filter(apt => apt.status === 'COMPLETED');

                setStats({
                    totalAppointments: appointments.length,
                    upcomingCount: upcoming.length,
                    completedCount: completed.length
                });

                // Set upcoming appointments
                setUpcomingAppointments(
                    upcoming
                        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                        .slice(0, 3)
                );
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            icon: Calendar,
            title: 'Book Appointment',
            description: 'Schedule your next treatment',
            link: '/patient/book',
            gradient: 'from-violet-500 to-purple-600',
            iconBg: 'bg-violet-100',
            iconColor: 'text-violet-600'
        },
        {
            icon: Clock,
            title: 'My Appointments',
            description: 'View all your bookings',
            link: '/patient/appointments',
            gradient: 'from-rose-500 to-pink-600',
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600'
        },
        {
            icon: User,
            title: 'My Profile',
            description: 'Update your information',
            link: '/patient/profile',
            gradient: 'from-teal-500 to-cyan-600',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600'
        }
    ];

    const statsCards = [
        {
            label: 'Total Treatments',
            value: stats.totalAppointments,
            icon: Activity,
            gradient: 'gradient-primary',
            change: '+12% this month'
        },
        {
            label: 'Upcoming',
            value: stats.upcomingCount,
            icon: Calendar,
            gradient: 'gradient-secondary',
            change: 'Next in 3 days'
        },
        {
            label: 'Completed',
            value: stats.completedCount,
            icon: Award,
            gradient: 'gradient-accent',
            change: '98% satisfaction'
        }
    ];

    const serviceCategories = [
        {
            name: 'Weight Loss',
            image: 'https://www.lifescc.com/img/t6.png',
            description: 'Explore weight loss treatments'
        },
        {
            name: 'Skin Care',
            image: 'https://www.lifescc.com/img/scul3.jpg',
            description: 'Explore skin care treatments'
        },
        {
            name: 'Hair Care',
            image: 'https://www.lifescc.com/img/home.jpg',
            description: 'Explore hair care treatments'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Welcome back,</p>
                                <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-12">
                {/* Hero Welcome Section */}
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-6 h-6 text-rose-500" />
                        <span className="text-sm font-medium text-gray-600">Your Beauty Journey</span>
                    </div>
                    <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-4 text-gray-900">
                        Welcome back,
                        <span className="gradient-text block">{user?.firstName}!</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Continue your transformation with personalized treatments
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {statsCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-premium animate-scale-in delay-${index * 100}`}
                        >
                            <div className={`absolute inset-0 ${stat.gradient}`}></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className="w-10 h-10 opacity-80" />
                                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm opacity-90">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className={`group animate-fade-in delay-${(index + 1) * 100}`}
                        >
                            <Card className="hover-lift border-0 shadow-soft bg-white">
                                <CardContent className="p-8">
                                    <div className={`inline-flex p-4 rounded-2xl ${action.iconBg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                                    </div>
                                    <h3 className="font-['Poppins'] text-2xl font-semibold mb-2 text-gray-900 group-hover:text-violet-600 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {action.description}
                                    </p>
                                    <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all">
                                        <span>Get Started</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Upcoming Appointments */}
                <Card className="mb-12 shadow-soft border-0 rounded-2xl animate-fade-in">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="font-['Playfair_Display'] text-3xl">
                                    Upcoming Appointments
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Your scheduled treatments and consultations
                                </CardDescription>
                            </div>
                            <Link to="/patient/appointments">
                                <Button className="btn-primary">
                                    View All
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600"></div>
                            </div>
                        ) : upcomingAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📅</div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
                                <p className="text-gray-600 mb-6">Schedule your next treatment to continue your journey</p>
                                <Link to="/patient/book">
                                    <Button className="btn-primary text-lg px-8 py-6">
                                        <Calendar className="w-5 h-5" />
                                        Book Appointment
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment, index) => (
                                    <div
                                        key={appointment.id}
                                        className={`group flex items-start justify-between p-6 border-2 border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-lg transition-all duration-300 animate-slide-in-left delay-${index * 100}`}
                                    >
                                        <div className="flex gap-6 flex-1">
                                            <div className="flex-shrink-0 w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white">
                                                <Calendar className="w-10 h-10" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-['Poppins'] text-xl font-semibold mb-2 text-gray-900 group-hover:text-violet-600 transition-colors">
                                                    {appointment.service?.name}
                                                </h4>
                                                <div className="space-y-2 text-gray-600">
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-violet-600">📍</span>
                                                        {appointment.branch?.name}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="text-violet-600">📅</span>
                                                        {formatDate(appointment.appointmentDate, 'PPP')} at <span className="font-semibold">{appointment.timeSlot}</span>
                                                    </p>
                                                    {appointment.service?.price && (
                                                        <p className="flex items-center gap-2">
                                                            <span className="text-violet-600">💰</span>
                                                            <span className="font-semibold text-gray-900">{formatCurrency(appointment.service.price)}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${APPOINTMENT_STATUS_COLORS[appointment.status]}`}>
                                                {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                            </span>
                                            <Link to="/patient/appointments">
                                                <Button variant="outline" className="group-hover:bg-violet-50 group-hover:border-violet-300 transition-colors">
                                                    View Details
                                                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Service Categories */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-2">
                                Explore Our Services
                            </h2>
                            <p className="text-lg text-gray-600">
                                Discover treatments tailored to your needs
                            </p>
                        </div>
                        <Link to="/services">
                            <Button
                                size="lg"
                                className="bg-white text-violet-600 hover:bg-gray-50 border-2 border-violet-200 hover:border-violet-300 px-8 py-3 rounded-xl font-semibold shadow-soft hover-lift transition-all duration-300"
                            >
                                View All Services
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {serviceCategories.map((category, index) => (
                            <Link
                                key={index}
                                to="/services"
                                className={`group animate-scale-in delay-${(index + 2) * 100}`}
                            >
                                <Card className="hover-lift border-0 shadow-soft bg-white overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="relative w-full h-48 overflow-hidden">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-['Poppins'] text-2xl font-semibold mb-2 text-gray-900">
                                                {category.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {category.description}
                                            </p>
                                            <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all">
                                                <span>Learn More</span>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

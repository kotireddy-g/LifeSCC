import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, LogOut } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUpcomingAppointments();
    }, []);

    const loadUpcomingAppointments = async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getMyAppointments();
            if (response.success && response.data) {
                // Filter upcoming appointments
                const now = new Date();
                const upcoming = response.data
                    .filter(apt => new Date(apt.appointmentDate) >= now)
                    .filter(apt => apt.status === 'PENDING' || apt.status === 'CONFIRMED')
                    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                    .slice(0, 3);
                setUpcomingAppointments(upcoming);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold gradient-text">
                            LifeSCC
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Welcome, <span className="font-medium text-foreground">{user?.firstName}</span>
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your appointments and explore our services
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link to="/patient/book">
                        <Card className="hover:shadow-lg transition cursor-pointer border-primary/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Book Appointment
                                </CardTitle>
                                <CardDescription>Schedule your next treatment</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/patient/appointments">
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    My Appointments
                                </CardTitle>
                                <CardDescription>View all your bookings</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/patient/profile">
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    My Profile
                                </CardTitle>
                                <CardDescription>Update your information</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* Upcoming Appointments */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <Link to="/patient/appointments">
                                <Button variant="link">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : upcomingAppointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                                <Link to="/patient/book">
                                    <Button>Book Your First Appointment</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">{appointment.service?.name}</h3>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>📍 {appointment.branch?.name}</p>
                                                <p>📅 {formatDate(appointment.appointmentDate, 'PPP')} at {appointment.timeSlot}</p>
                                                {appointment.service?.price && (
                                                    <p>💰 {formatCurrency(appointment.service.price)}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${APPOINTMENT_STATUS_COLORS[appointment.status]}`}>
                                                {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                            </span>
                                            <Link to={`/patient/appointments`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Popular Services */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Explore Our Services</h2>
                        <Link to="/services">
                            <Button variant="link">View All Services</Button>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {['Weight Loss', 'Skin Care', 'Hair Care'].map((category, idx) => (
                            <Link key={idx} to="/services">
                                <Card className="hover:shadow-lg transition cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="text-4xl mb-3">
                                            {idx === 0 ? '⚖️' : idx === 1 ? '✨' : '💇'}
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1">{category}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Explore {category.toLowerCase()} treatments
                                        </p>
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

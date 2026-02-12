import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, XCircle, LogOut, CheckCircle, AlertCircle, Ban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import appointmentService from '@/services/appointment.service';
import { Appointment } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
    APPOINTMENT_STATUS,
    APPOINTMENT_STATUS_COLORS,
    APPOINTMENT_STATUS_LABELS
} from '@/lib/constants';
import { toast } from 'sonner';

export default function MyAppointments() {
    const { logout } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [appointments, selectedStatus]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getMyAppointments();
            if (response.success && response.data) {
                const sorted = response.data.sort(
                    (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
                );
                setAppointments(sorted);
            }
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        if (selectedStatus === 'all') {
            setFilteredAppointments(appointments);
        } else {
            setFilteredAppointments(appointments.filter(apt => apt.status === selectedStatus));
        }
    };

    const handleCancelAppointment = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        setCancellingId(id);
        try {
            const response = await appointmentService.cancelAppointment(id, 'Cancelled by patient');
            if (response.success) {
                toast.success('Appointment cancelled successfully');
                loadAppointments();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        } finally {
            setCancellingId(null);
        }
    };

    const canCancelAppointment = (appointment: Appointment) => {
        const aptDate = new Date(appointment.appointmentDate);
        const now = new Date();
        const hoursDiff = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        return (
            (appointment.status === APPOINTMENT_STATUS.PENDING ||
                appointment.status === APPOINTMENT_STATUS.CONFIRMED) &&
            hoursDiff > 24
        );
    };

    const statusFilters = [
        { value: 'all', label: 'All', icon: Calendar },
        { value: APPOINTMENT_STATUS.PENDING, label: 'Pending', icon: AlertCircle },
        { value: APPOINTMENT_STATUS.CONFIRMED, label: 'Confirmed', icon: CheckCircle },
        { value: APPOINTMENT_STATUS.COMPLETED, label: 'Completed', icon: CheckCircle },
        { value: APPOINTMENT_STATUS.CANCELLED, label: 'Cancelled', icon: Ban }
    ];

    const stats = [
        {
            label: 'Total',
            value: appointments.length,
            gradient: 'from-violet-500 to-purple-600',
            icon: Calendar
        },
        {
            label: 'Confirmed',
            value: appointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED).length,
            gradient: 'from-blue-500 to-cyan-600',
            icon: CheckCircle
        },
        {
            label: 'Completed',
            value: appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length,
            gradient: 'from-emerald-500 to-teal-600',
            icon: CheckCircle
        },
        {
            label: 'Pending',
            value: appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length,
            gradient: 'from-amber-500 to-orange-600',
            icon: AlertCircle
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />

            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/patient/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-bold gradient-text">LifeSCC</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/patient/dashboard">
                                <Button variant="ghost" size="sm" className="hover:bg-violet-50">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-violet-50">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            My Appointments
                        </h1>
                        <p className="text-gray-600 text-lg">
                            View and manage all your bookings
                        </p>
                    </div>
                    <Link to="/patient/book">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-200 hover-lift"
                        >
                            <Calendar className="h-5 w-5 mr-2" />
                            Book New Appointment
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-3">
                        {statusFilters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = selectedStatus === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedStatus(filter.value)}
                                    className={`
                                        px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                                        ${isActive
                                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200 scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-violet-200 hover-lift'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Appointments List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600 absolute top-0"></div>
                        </div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <Card className="border-0 shadow-soft bg-white/90 backdrop-blur">
                        <CardContent className="py-16 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                                <Calendar className="h-10 w-10 text-violet-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">No appointments found</h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                {selectedStatus === 'all'
                                    ? "You haven't booked any appointments yet"
                                    : `No ${selectedStatus.toLowerCase()} appointments`}
                            </p>
                            <Link to="/patient/book">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-200"
                                >
                                    Book Your First Appointment
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => {
                            const isPast = new Date(appointment.appointmentDate) < new Date();
                            const canCancel = canCancelAppointment(appointment);

                            return (
                                <Card
                                    key={appointment.id}
                                    className="border-0 shadow-soft bg-white/90 backdrop-blur hover-lift transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-600" />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {appointment.service?.name}
                                                    </h3>
                                                    <span
                                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold ${APPOINTMENT_STATUS_COLORS[appointment.status]}`}
                                                    >
                                                        {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                                    </span>
                                                    {isPast && appointment.status !== APPOINTMENT_STATUS.COMPLETED && (
                                                        <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                                                            Past
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 text-gray-700">
                                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                                                <Calendar className="h-4 w-4 text-violet-600" />
                                                            </div>
                                                            <span className="font-medium">{formatDate(appointment.appointmentDate, 'PPP')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-gray-700">
                                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                                                <Clock className="h-4 w-4 text-violet-600" />
                                                            </div>
                                                            <span className="font-medium">{appointment.timeSlot}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3 text-gray-700">
                                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                                                                <MapPin className="h-4 w-4 text-violet-600" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">
                                                                    {appointment.branch?.name}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {appointment.branch?.address}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {appointment.service?.price && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <span className="text-gray-600">Price: </span>
                                                        <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                                            {formatCurrency(appointment.service.price)}
                                                        </span>
                                                    </div>
                                                )}

                                                {appointment.notes && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <span className="text-sm font-semibold text-gray-700">Notes: </span>
                                                        <span className="text-sm text-gray-600">{appointment.notes}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {canCancel && (
                                                <div className="ml-4">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                        disabled={cancellingId === appointment.id}
                                                        className="hover-lift"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Stats Summary */}
                {!loading && appointments.length > 0 && (
                    <div className="grid md:grid-cols-4 gap-6 mt-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card
                                    key={index}
                                    className="border-0 shadow-soft bg-white/90 backdrop-blur hover-lift transition-all duration-300 overflow-hidden"
                                >
                                    <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
                                    <CardContent className="p-6 text-center">
                                        <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

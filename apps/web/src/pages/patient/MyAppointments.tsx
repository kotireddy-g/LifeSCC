import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const { user, logout } = useAuth();
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
                // Sort by date descending
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
            hoursDiff > 24 // Can cancel at least 24 hours before
        );
    };

    const statusFilters = [
        { value: 'all', label: 'All' },
        { value: APPOINTMENT_STATUS.PENDING, label: 'Pending' },
        { value: APPOINTMENT_STATUS.CONFIRMED, label: 'Confirmed' },
        { value: APPOINTMENT_STATUS.COMPLETED, label: 'Completed' },
        { value: APPOINTMENT_STATUS.CANCELLED, label: 'Cancelled' }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/patient/dashboard" className="text-2xl font-bold gradient-text">
                            LifeSCC
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/patient/dashboard">
                                <Button variant="ghost" size="sm">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
                        <p className="text-muted-foreground">
                            View and manage all your bookings
                        </p>
                    </div>
                    <Link to="/patient/book">
                        <Button>
                            <Calendar className="h-4 w-4 mr-2" />
                            Book New Appointment
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filter by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    variant={selectedStatus === filter.value ? 'default' : 'outline'}
                                    onClick={() => setSelectedStatus(filter.value)}
                                    size="sm"
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Appointments List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
                            <p className="text-muted-foreground mb-6">
                                {selectedStatus === 'all'
                                    ? "You haven't booked any appointments yet"
                                    : `No ${selectedStatus.toLowerCase()} appointments`}
                            </p>
                            <Link to="/patient/book">
                                <Button>Book Your First Appointment</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => {
                            const isPast = new Date(appointment.appointmentDate) < new Date();
                            const canCancel = canCancelAppointment(appointment);

                            return (
                                <Card key={appointment.id} className="hover:shadow-md transition">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <h3 className="text-xl font-semibold">
                                                                {appointment.service?.name}
                                                            </h3>
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded ${APPOINTMENT_STATUS_COLORS[appointment.status]
                                                                    }`}
                                                            >
                                                                {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                                            </span>
                                                            {isPast && appointment.status !== APPOINTMENT_STATUS.COMPLETED && (
                                                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                                                                    Past
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>{formatDate(appointment.appointmentDate, 'PPP')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span>{appointment.timeSlot}</span>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2 text-muted-foreground">
                                                                    <MapPin className="h-4 w-4 mt-0.5" />
                                                                    <div>
                                                                        <div className="font-medium text-foreground">
                                                                            {appointment.branch?.name}
                                                                        </div>
                                                                        <div className="text-xs">
                                                                            {appointment.branch?.address}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {appointment.service?.price && (
                                                            <div className="mt-3 pt-3 border-t">
                                                                <span className="text-sm text-muted-foreground">Price: </span>
                                                                <span className="font-semibold text-primary">
                                                                    {formatCurrency(appointment.service.price)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {appointment.notes && (
                                                            <div className="mt-3 pt-3 border-t">
                                                                <span className="text-sm text-muted-foreground">Notes: </span>
                                                                <span className="text-sm">{appointment.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 ml-4">
                                                {canCancel && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                        disabled={cancellingId === appointment.id}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Stats Summary */}
                {!loading && appointments.length > 0 && (
                    <div className="grid md:grid-cols-4 gap-4 mt-8">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {appointments.length}
                                </div>
                                <div className="text-sm text-muted-foreground">Total</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {appointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Confirmed</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {appointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {appointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

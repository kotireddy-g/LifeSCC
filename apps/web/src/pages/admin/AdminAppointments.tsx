import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Calendar, Search, Filter, Phone, Mail, MapPin, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import adminService from '@/services/admin.service';
import branchService from '@/services/branch.service';
import serviceService from '@/services/service.service';
import { Appointment, Branch, Service } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
    APPOINTMENT_STATUS,
    APPOINTMENT_STATUS_COLORS,
    APPOINTMENT_STATUS_LABELS
} from '@/lib/constants';
import { toast } from 'sonner';

export default function AdminAppointments() {
    const { user, logout } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
    }, [statusFilter, branchFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, branchesRes, servicesRes] = await Promise.all([
                adminService.getAllAppointments({
                    status: statusFilter || undefined,
                    branchId: branchFilter || undefined
                }),
                branchService.getAllBranches(),
                serviceService.getAllServices()
            ]);

            if (appointmentsRes.success && appointmentsRes.data) {
                setAppointments(appointmentsRes.data.appointments);
            }
            if (branchesRes.success && branchesRes.data) {
                setBranches(branchesRes.data.branches);
            }
            if (servicesRes.success && servicesRes.data) {
                setServices(servicesRes.data.services);
            }
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            const response = await adminService.updateAppointmentStatus(id, newStatus);
            if (response.success) {
                toast.success('Appointment status updated');
                loadData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                apt.patientName.toLowerCase().includes(query) ||
                apt.patientPhone.includes(query) ||
                apt.service?.name.toLowerCase().includes(query) ||
                apt.branch?.name.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            LifeSCC Admin
                        </Link>
                        <div className="flex items-center gap-4">
                            <nav className="hidden md:flex items-center gap-2">
                                <Link to="/admin/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="default" size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Appointments
                                </Button>
                                <Link to="/admin/leads">
                                    <Button variant="ghost" size="sm">Leads</Button>
                                </Link>
                                <Link to="/admin/patients">
                                    <Button variant="ghost" size="sm">Patients</Button>
                                </Link>
                            </nav>
                            <span className="text-sm text-muted-foreground">{user?.firstName}</span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
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
                            Manage Appointments
                        </h1>
                        <p className="text-gray-600 text-lg">
                            View and manage all clinic appointments
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6 overflow-hidden bg-white/90 backdrop-blur shadow-soft border-gray-100">
                        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-violet-600" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                                    >
                                        <option value="">All Statuses</option>
                                        {Object.values(APPOINTMENT_STATUS).map((status) => (
                                            <option key={status} value={status}>
                                                {APPOINTMENT_STATUS_LABELS[status]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Branch</Label>
                                    <select
                                        value={branchFilter}
                                        onChange={(e) => setBranchFilter(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Name, phone, service..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 focus-visible:ring-violet-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Appointments List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="relative h-20 w-20">
                            <div className="absolute inset-0 rounded-full border-4 border-violet-200 opacity-25" />
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
                        </div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <Card className="overflow-hidden bg-white/90 backdrop-blur shadow-soft">
                        <CardContent className="py-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                                <Calendar className="h-10 w-10 text-violet-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">No appointments found</h3>
                            <p className="text-gray-600 text-lg">
                                Try adjusting your filters
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <Card key={appointment.id} className="group hover-lift overflow-hidden bg-white/90 backdrop-blur shadow-soft border-gray-100">
                                <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-12 gap-4">
                                        {/* Patient Info */}
                                        <div className="md:col-span-3">
                                            <div className="font-semibold text-gray-900 mb-2">{appointment.patientName}</div>
                                            <div className="text-sm text-gray-600 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-violet-600" />
                                                    {appointment.patientPhone}
                                                </div>
                                                {appointment.patientEmail && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-violet-600" />
                                                        {appointment.patientEmail}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="md:col-span-4">
                                            <div className="font-semibold text-gray-900 mb-2">{appointment.service?.name}</div>
                                            <div className="text-sm text-gray-600 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-violet-600" />
                                                    {appointment.branch?.name}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-violet-600" />
                                                    {formatDate(appointment.appointmentDate, 'PPP')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-violet-600" />
                                                    {appointment.timeSlot}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Status */}
                                        <div className="md:col-span-2">
                                            <div className="font-bold text-lg mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                {appointment.service?.price ? formatCurrency(appointment.service.price) : 'N/A'}
                                            </div>
                                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${APPOINTMENT_STATUS_COLORS[appointment.status]}`}>
                                                {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-3 flex flex-col gap-2">
                                            {appointment.status === APPOINTMENT_STATUS.PENDING && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                                    onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.CONFIRMED)}
                                                    disabled={updating === appointment.id}
                                                >
                                                    {updating === appointment.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                            Confirm
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {appointment.status === APPOINTMENT_STATUS.CONFIRMED && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                                    onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.COMPLETED)}
                                                    disabled={updating === appointment.id}
                                                >
                                                    {updating === appointment.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                            Mark Complete
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            {(appointment.status === APPOINTMENT_STATUS.PENDING ||
                                                appointment.status === APPOINTMENT_STATUS.CONFIRMED) && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl"
                                                        onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.CANCELLED)}
                                                        disabled={updating === appointment.id}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-sm font-medium text-gray-700">Notes: </span>
                                            <span className="text-sm text-gray-600">{appointment.notes}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {!loading && filteredAppointments.length > 0 && (
                    <div className="grid md:grid-cols-4 gap-4 mt-8">
                        <Card className="overflow-hidden bg-white/90 backdrop-blur shadow-soft hover-lift">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {filteredAppointments.length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Total Shown</div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden bg-white/90 backdrop-blur shadow-soft hover-lift">
                            <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-2">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Pending</div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden bg-white/90 backdrop-blur shadow-soft hover-lift">
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED).length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Confirmed</div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden bg-white/90 backdrop-blur shadow-soft hover-lift">
                            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Completed</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

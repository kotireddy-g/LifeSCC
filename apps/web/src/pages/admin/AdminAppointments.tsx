import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Calendar, Search, Filter } from 'lucide-react';
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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/admin/dashboard" className="text-2xl font-bold gradient-text">
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
                                <Button variant="default" size="sm">
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

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Manage Appointments</h1>
                        <p className="text-muted-foreground">
                            View and manage all clinic appointments
                        </p>
                    </div>
                    <Button onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Appointments Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your filters
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <Card key={appointment.id}>
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-12 gap-4">
                                        {/* Patient Info */}
                                        <div className="md:col-span-3">
                                            <div className="font-semibold mb-1">{appointment.patientName}</div>
                                            <div className="text-sm text-muted-foreground space-y-0.5">
                                                <div>📞 {appointment.patientPhone}</div>
                                                {appointment.patientEmail && (
                                                    <div>✉️ {appointment.patientEmail}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="md:col-span-4">
                                            <div className="font-semibold mb-1">{appointment.service?.name}</div>
                                            <div className="text-sm text-muted-foreground space-y-0.5">
                                                <div>📍 {appointment.branch?.name}</div>
                                                <div>📅 {formatDate(appointment.appointmentDate, 'PPP')}</div>
                                                <div>🕒 {appointment.timeSlot}</div>
                                            </div>
                                        </div>

                                        {/* Price & Status */}
                                        <div className="md:col-span-2">
                                            <div className="font-semibold text-primary mb-1">
                                                {appointment.service?.price ? formatCurrency(appointment.service.price) : 'N/A'}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${APPOINTMENT_STATUS_COLORS[appointment.status]}`}>
                                                {APPOINTMENT_STATUS_LABELS[appointment.status]}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-3 flex flex-col gap-2">
                                            {appointment.status === APPOINTMENT_STATUS.PENDING && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.CONFIRMED)}
                                                    disabled={updating === appointment.id}
                                                >
                                                    {updating === appointment.id ? 'Updating...' : 'Confirm'}
                                                </Button>
                                            )}
                                            {appointment.status === APPOINTMENT_STATUS.CONFIRMED && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.COMPLETED)}
                                                    disabled={updating === appointment.id}
                                                >
                                                    {updating === appointment.id ? 'Updating...' : 'Mark Complete'}
                                                </Button>
                                            )}
                                            {(appointment.status === APPOINTMENT_STATUS.PENDING ||
                                                appointment.status === APPOINTMENT_STATUS.CONFIRMED) && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusUpdate(appointment.id, APPOINTMENT_STATUS.CANCELLED)}
                                                        disabled={updating === appointment.id}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="mt-4 pt-4 border-t">
                                            <span className="text-sm text-muted-foreground">Notes: </span>
                                            <span className="text-sm">{appointment.notes}</span>
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
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{filteredAppointments.length}</div>
                                <div className="text-sm text-muted-foreground">Total Shown</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.PENDING).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.CONFIRMED).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Confirmed</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {filteredAppointments.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length}
                                </div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

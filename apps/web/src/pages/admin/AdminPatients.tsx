import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, TrendingUp, Search, Phone, Mail, Calendar, User, Sparkles, MapPin, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import adminService from '@/services/admin.service';
import { User as UserType, Appointment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPatients() {
    const { user, logout } = useAuth();
    const [patients, setPatients] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Patient details modal
    const [selectedPatient, setSelectedPatient] = useState<UserType | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllPatients();

            if (response.success && response.data) {
                setPatients(response.data.patients || []);
            }
        } catch (error) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const openPatientDetails = async (patient: UserType) => {
        setSelectedPatient(patient);
        setShowDetailsModal(true);
        setLoadingAppointments(true);

        try {
            // Fetch patient's appointments
            const response = await adminService.getAllAppointments({
                // If there's a userId filter available
            });

            if (response.success && response.data) {
                // Filter appointments for this patient
                const userAppointments = response.data.appointments.filter(
                    apt => apt.userId === patient.id
                );
                setPatientAppointments(userAppointments);
            }
        } catch (error) {
            console.error('Failed to load patient appointments:', error);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const filteredPatients = patients.filter(patient => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                patient.firstName.toLowerCase().includes(query) ||
                patient.lastName.toLowerCase().includes(query) ||
                patient.email.toLowerCase().includes(query) ||
                patient.phone?.includes(query)
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="border-b bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-soft">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/admin/dashboard" className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-['Playfair_Display'] font-bold gradient-text">
                                LifeSCC Admin
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <nav className="hidden md:flex items-center gap-2">
                                <Link to="/admin/dashboard">
                                    <Button variant="ghost" size="sm" className="rounded-xl">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link to="/admin/appointments">
                                    <Button variant="ghost" size="sm" className="rounded-xl">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Appointments
                                    </Button>
                                </Link>
                                <Link to="/admin/leads">
                                    <Button variant="ghost" size="sm" className="rounded-xl">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Leads
                                    </Button>
                                </Link>
                                <Button variant="default" size="sm" className="rounded-xl btn-primary">
                                    <Users className="h-4 w-4 mr-2" />
                                    Patients
                                </Button>
                            </nav>
                            <span className="text-sm text-muted-foreground font-medium">{user?.firstName}</span>
                            <Button variant="ghost" size="sm" onClick={logout} className="rounded-xl">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="animate-fade-in">
                        <h1 className="text-4xl font-['Playfair_Display'] font-bold mb-2 gradient-text">
                            Patient Management
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            View and manage all registered patients
                        </p>
                    </div>
                </div>

                {/* Search */}
                <Card className="mb-6 rounded-2xl shadow-soft border-0 animate-fade-in">
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Search Patients</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 rounded-xl border-input h-12 text-base"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patients List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                        </div>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <Card className="rounded-2xl shadow-soft border-0">
                        <CardContent className="py-16 text-center">
                            <Users className="h-20 w-20 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-2xl font-['Playfair_Display'] font-semibold mb-2">No patients found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? 'Try adjusting your search query'
                                    : 'Registered patients will appear here'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredPatients.map((patient, index) => (
                            <Card
                                key={patient.id}
                                className="rounded-2xl shadow-soft border-0 hover-lift animate-fade-in bg-white/95 backdrop-blur-sm"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-12 gap-4">
                                        {/* Patient Info */}
                                        <div className="md:col-span-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <User className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-lg">
                                                    {patient.firstName} {patient.lastName}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {patient.email}
                                                </div>
                                                {patient.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {patient.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="md:col-span-4">
                                            <div className="space-y-2">
                                                {patient.dateOfBirth && (
                                                    <div>
                                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Date of Birth</span>
                                                        <p className="text-sm">{formatDate(patient.dateOfBirth, 'PP')}</p>
                                                    </div>
                                                )}
                                                {patient.gender && (
                                                    <div>
                                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Gender</span>
                                                        <p className="text-sm">{patient.gender}</p>
                                                    </div>
                                                )}
                                                {(patient.city || patient.state) && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {patient.city}{patient.city && patient.state && ', '}{patient.state}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Account Status */}
                                        <div className="md:col-span-2">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Status</span>
                                                    {patient.isVerified ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Not Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    <span className="block">Joined</span>
                                                    {formatDate(patient.createdAt, 'PP')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-2 flex items-center">
                                            <Button
                                                size="sm"
                                                onClick={() => openPatientDetails(patient)}
                                                className="rounded-xl btn-primary w-full"
                                            >
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>

                                    {patient.address && (
                                        <div className="mt-4 pt-4 border-t">
                                            <span className="text-xs font-medium text-muted-foreground uppercase">Address: </span>
                                            <span className="text-sm">{patient.address}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {!loading && filteredPatients.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                        <Card className="rounded-2xl shadow-soft border-0 bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{filteredPatients.length}</div>
                                <div className="text-sm text-muted-foreground">Total Patients</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-green-50/50">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {filteredPatients.filter(p => p.isVerified).length}
                                </div>
                                <div className="text-sm text-green-700">Verified Accounts</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-blue-50/50">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {filteredPatients.filter(p => !p.isVerified).length}
                                </div>
                                <div className="text-sm text-blue-700">Pending Verification</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Patient Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="rounded-2xl max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-['Playfair_Display'] text-2xl">Patient Details</DialogTitle>
                    </DialogHeader>

                    {selectedPatient && (
                        <div className="space-y-6 py-4">
                            {/* Patient Information */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Full Name</span>
                                        <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Email</span>
                                        <p className="text-sm">{selectedPatient.email}</p>
                                    </div>
                                    {selectedPatient.phone && (
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Phone</span>
                                            <p className="text-sm">{selectedPatient.phone}</p>
                                        </div>
                                    )}
                                    {selectedPatient.dateOfBirth && (
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Date of Birth</span>
                                            <p className="text-sm">{formatDate(selectedPatient.dateOfBirth, 'PP')}</p>
                                        </div>
                                    )}
                                    {selectedPatient.gender && (
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Gender</span>
                                            <p className="text-sm">{selectedPatient.gender}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Account Status</span>
                                        {selectedPatient.isVerified ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Not Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {(selectedPatient.address || selectedPatient.city || selectedPatient.state) && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                                        <span className="text-xs font-medium text-muted-foreground uppercase block mb-2">Address</span>
                                        <p className="text-sm">
                                            {selectedPatient.address}
                                            {selectedPatient.address && (selectedPatient.city || selectedPatient.state) && <br />}
                                            {selectedPatient.city}{selectedPatient.city && selectedPatient.state && ', '}{selectedPatient.state} {selectedPatient.pincode}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Appointment History */}
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Appointment History</h3>
                                {loadingAppointments ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </div>
                                ) : patientAppointments.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                                        <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                                        <p className="text-muted-foreground text-sm">No appointments found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {patientAppointments.map((apt) => (
                                            <div key={apt.id} className="bg-gray-50 p-4 rounded-xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-medium">{apt.service?.name}</div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                            apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div>📅 {formatDate(apt.appointmentDate, 'PPP')}</div>
                                                    <div>🕒 {apt.timeSlot}</div>
                                                    <div>📍 {apt.branch?.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase">Account Information</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Role:</span>
                                        <span className="ml-2 font-medium">{selectedPatient.role}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Joined:</span>
                                        <span className="ml-2 font-medium">{formatDate(selectedPatient.createdAt, 'PP')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

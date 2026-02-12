import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, TrendingUp, Search, Filter, Phone, Mail, Calendar, User, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import adminService from '@/services/admin.service';
import branchService from '@/services/branch.service';
import serviceService from '@/services/service.service';
import { Lead, Branch, Service, LEAD_STATUS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE, LEAD_SOURCE_LABELS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminLeads() {
    const { user, logout } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Modals
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');

    // Conversion form
    const [conversionData, setConversionData] = useState({
        serviceId: '',
        branchId: '',
        appointmentDate: '',
        timeSlot: ''
    });

    useEffect(() => {
        loadData();
    }, [statusFilter, sourceFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [leadsRes, branchesRes, servicesRes] = await Promise.all([
                adminService.getAllLeads({
                    status: statusFilter || undefined,
                    source: sourceFilter || undefined
                }),
                branchService.getAllBranches(),
                serviceService.getAllServices()
            ]);

            if (leadsRes.success && leadsRes.data) {
                setLeads(leadsRes.data.leads);
            }
            if (branchesRes.success && branchesRes.data) {
                setBranches(branchesRes.data.branches);
            }
            if (servicesRes.success && servicesRes.data) {
                setServices(servicesRes.data.services);
            }
        } catch (error) {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedLead || !newStatus) return;

        setUpdating(selectedLead.id);
        try {
            const response = await adminService.updateLead(selectedLead.id, {
                status: newStatus,
                notes: notes || undefined
            });

            if (response.success) {
                toast.success('Lead status updated successfully');
                setShowStatusModal(false);
                setSelectedLead(null);
                setNewStatus('');
                setNotes('');
                loadData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update lead');
        } finally {
            setUpdating(null);
        }
    };

    const handleConvertLead = async () => {
        if (!selectedLead || !conversionData.serviceId || !conversionData.branchId || !conversionData.appointmentDate || !conversionData.timeSlot) {
            toast.error('Please fill all required fields');
            return;
        }

        setUpdating(selectedLead.id);
        try {
            const response = await adminService.convertLeadToAppointment(selectedLead.id, conversionData);

            if (response.success) {
                toast.success('Lead converted to appointment successfully!');
                setShowConvertModal(false);
                setSelectedLead(null);
                setConversionData({ serviceId: '', branchId: '', appointmentDate: '', timeSlot: '' });
                loadData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to convert lead');
        } finally {
            setUpdating(null);
        }
    };

    const filteredLeads = leads.filter(lead => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                lead.name.toLowerCase().includes(query) ||
                lead.phone.includes(query) ||
                lead.email?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const openStatusModal = (lead: Lead) => {
        setSelectedLead(lead);
        setNewStatus(lead.status);
        setNotes(lead.notes || '');
        setShowStatusModal(true);
    };

    const openConvertModal = (lead: Lead) => {
        setSelectedLead(lead);
        setShowConvertModal(true);
    };

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
                                <Button variant="default" size="sm" className="rounded-xl btn-primary">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Leads
                                </Button>
                                <Link to="/admin/patients">
                                    <Button variant="ghost" size="sm" className="rounded-xl">
                                        <Users className="h-4 w-4 mr-2" />
                                        Patients
                                    </Button>
                                </Link>
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
                            Lead Management
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Track and convert leads into appointments
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        className="rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 hover:from-violet-200 hover:to-purple-200 border border-violet-300"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6 rounded-2xl shadow-soft border-0 animate-fade-in">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status</Label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm shadow-sm transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">All Statuses</option>
                                        {Object.values(LEAD_STATUS).map((status) => (
                                            <option key={status} value={status}>
                                                {LEAD_STATUS_LABELS[status]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Source</Label>
                                    <select
                                        value={sourceFilter}
                                        onChange={(e) => setSourceFilter(e.target.value)}
                                        className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm shadow-sm transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">All Sources</option>
                                        {Object.values(LEAD_SOURCE).map((source) => (
                                            <option key={source} value={source}>
                                                {LEAD_SOURCE_LABELS[source]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Name, phone, email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 rounded-xl border-input h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Leads List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                        </div>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <Card className="rounded-2xl shadow-soft border-0">
                        <CardContent className="py-16 text-center">
                            <TrendingUp className="h-20 w-20 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-2xl font-['Playfair_Display'] font-semibold mb-2">No leads found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || statusFilter || sourceFilter
                                    ? 'Try adjusting your filters'
                                    : 'New leads will appear here'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredLeads.map((lead, index) => (
                            <Card
                                key={lead.id}
                                className="rounded-2xl shadow-soft border-0 hover-lift animate-fade-in bg-white/95 backdrop-blur-sm"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-12 gap-4">
                                        {/* Lead Info */}
                                        <div className="md:col-span-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-lg">{lead.name}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {lead.phone}
                                                </div>
                                                {lead.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {lead.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message & Interest */}
                                        <div className="md:col-span-4">
                                            {lead.message && (
                                                <div className="mb-2">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase">Message</span>
                                                    <p className="text-sm mt-1">{lead.message}</p>
                                                </div>
                                            )}
                                            {lead.serviceInterest && (
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase">Interest</span>
                                                    <p className="text-sm mt-1 font-medium text-primary">{lead.serviceInterest}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status & Source */}
                                        <div className="md:col-span-2">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Status</span>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${LEAD_STATUS_COLORS[lead.status]}`}>
                                                        {LEAD_STATUS_LABELS[lead.status]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase block mb-1">Source</span>
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                                                        {LEAD_SOURCE_LABELS[lead.source]}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDate(lead.createdAt, 'PP')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-3 flex flex-col gap-2">
                                            {lead.status !== LEAD_STATUS.CONVERTED && lead.status !== LEAD_STATUS.LOST && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openStatusModal(lead)}
                                                        disabled={updating === lead.id}
                                                        className="rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 hover:from-violet-200 hover:to-purple-200 border border-violet-300"
                                                    >
                                                        {updating === lead.id ? 'Updating...' : 'Update Status'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openConvertModal(lead)}
                                                        disabled={updating === lead.id}
                                                        className="rounded-xl btn-primary"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                        Convert to Appointment
                                                    </Button>
                                                </>
                                            )}
                                            {lead.status === LEAD_STATUS.CONVERTED && (
                                                <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Converted
                                                </div>
                                            )}
                                            {lead.status === LEAD_STATUS.LOST && (
                                                <div className="flex items-center justify-center gap-2 text-gray-500 font-medium text-sm">
                                                    <XCircle className="h-4 w-4" />
                                                    Lost
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {lead.notes && (
                                        <div className="mt-4 pt-4 border-t">
                                            <span className="text-xs font-medium text-muted-foreground uppercase">Notes: </span>
                                            <span className="text-sm">{lead.notes}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                {!loading && filteredLeads.length > 0 && (
                    <div className="grid md:grid-cols-5 gap-4 mt-8">
                        <Card className="rounded-2xl shadow-soft border-0 bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold gradient-text">{filteredLeads.length}</div>
                                <div className="text-sm text-muted-foreground mt-1">Total Leads</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-blue-50/50">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {filteredLeads.filter(l => l.status === LEAD_STATUS.NEW).length}
                                </div>
                                <div className="text-sm text-blue-700 mt-1">New</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-yellow-50/50">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-yellow-600">
                                    {filteredLeads.filter(l => l.status === LEAD_STATUS.CONTACTED).length}
                                </div>
                                <div className="text-sm text-yellow-700 mt-1">Contacted</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-purple-50/50">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {filteredLeads.filter(l => l.status === LEAD_STATUS.INTERESTED).length}
                                </div>
                                <div className="text-sm text-purple-700 mt-1">Interested</div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-soft border-0 bg-green-50/50">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {filteredLeads.filter(l => l.status === LEAD_STATUS.CONVERTED).length}
                                </div>
                                <div className="text-sm text-green-700 mt-1">Converted</div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Playfair_Display'] text-2xl">Update Lead Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm"
                            >
                                {Object.values(LEAD_STATUS).map((status) => (
                                    <option key={status} value={status}>
                                        {LEAD_STATUS_LABELS[status]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="flex w-full rounded-xl border border-input bg-white px-4 py-2 text-sm resize-none"
                                placeholder="Add any notes about this lead..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStatusModal(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={!!updating} className="rounded-xl btn-primary">
                            {updating ? 'Updating...' : 'Update Lead'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Convert to Appointment Modal */}
            <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
                <DialogContent className="rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-['Playfair_Display'] text-2xl">Convert to Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Service *</Label>
                            <select
                                value={conversionData.serviceId}
                                onChange={(e) => setConversionData({ ...conversionData, serviceId: e.target.value })}
                                className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm"
                            >
                                <option value="">Select a service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Branch *</Label>
                            <select
                                value={conversionData.branchId}
                                onChange={(e) => setConversionData({ ...conversionData, branchId: e.target.value })}
                                className="flex h-11 w-full rounded-xl border border-input bg-white px-4 py-2 text-sm"
                            >
                                <option value="">Select a branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Appointment Date *</Label>
                            <Input
                                type="date"
                                value={conversionData.appointmentDate}
                                onChange={(e) => setConversionData({ ...conversionData, appointmentDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="rounded-xl h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time Slot *</Label>
                            <Input
                                type="time"
                                value={conversionData.timeSlot}
                                onChange={(e) => setConversionData({ ...conversionData, timeSlot: e.target.value })}
                                className="rounded-xl h-11"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConvertModal(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={handleConvertLead} disabled={!!updating} className="rounded-xl btn-primary">
                            {updating ? 'Converting...' : 'Create Appointment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

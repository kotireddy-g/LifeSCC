import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, DollarSign, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardService from '@/services/dashboard.service';
import { DashboardStats } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { APPOINTMENT_STATUS_COLORS, LEAD_STATUS_COLORS } from '@/lib/constants';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold gradient-text">
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
                                <Link to="/admin/appointments">
                                    <Button variant="ghost" size="sm">Appointments</Button>
                                </Link>
                                <Link to="/admin/leads">
                                    <Button variant="ghost" size="sm">Leads</Button>
                                </Link>
                                <Link to="/admin/patients">
                                    <Button variant="ghost" size="sm">Patients</Button>
                                </Link>
                            </nav>
                            <span className="text-sm text-muted-foreground">
                                {user?.firstName}
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your clinic's performance
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats?.todayAppointments || 0} today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Appointment completion
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats?.estimatedRevenue || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                From completed appointments
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Appointments by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointments by Status</CardTitle>
                            <CardDescription>Current appointment distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats?.appointmentsByStatus.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${APPOINTMENT_STATUS_COLORS[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <span className="font-semibold">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leads by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads by Status</CardTitle>
                            <CardDescription>Lead conversion tracking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats?.leadsByStatus.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${LEAD_STATUS_COLORS[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <span className="font-semibold">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">New this week</span>
                                    <span className="font-semibold">{stats?.newLeads || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Link to="/admin/appointments">
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Manage Appointments
                                </CardTitle>
                                <CardDescription>
                                    View and update appointment statuses
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/admin/leads">
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Manage Leads
                                </CardTitle>
                                <CardDescription>
                                    Track and convert inquiries
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/admin/patients">
                        <Card className="hover:shadow-lg transition cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    View Patients
                                </CardTitle>
                                <CardDescription>
                                    Patient records and history
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar, Users, TrendingUp, DollarSign, LogOut, Sparkles,
    BarChart3, PieChart, Activity, ChevronRight, Award, Clock
} from 'lucide-react';
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

    const keyMetrics = [
        {
            label: 'Total Appointments',
            value: stats?.totalAppointments || 0,
            subValue: `${stats?.todayAppointments || 0} today`,
            icon: Calendar,
            gradient: 'gradient-primary',
            iconBg: 'bg-violet-100',
            iconColor: 'text-violet-600'
        },
        {
            label: 'Total Patients',
            value: stats?.totalPatients || 0,
            subValue: 'Registered users',
            icon: Users,
            gradient: 'gradient-secondary',
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600'
        },
        {
            label: 'Completion Rate',
            value: `${stats?.completionRate || 0}%`,
            subValue: 'Appointment success',
            icon: TrendingUp,
            gradient: 'gradient-accent',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600'
        },
        {
            label: 'Revenue',
            value: formatCurrency(stats?.estimatedRevenue || 0),
            subValue: 'Completed treatments',
            icon: DollarSign,
            gradient: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Appointments',
            description: 'View and update appointment statuses',
            link: '/admin/appointments',
            icon: Calendar,
            color: 'violet'
        },
        {
            title: 'Manage Leads',
            description: 'Track and convert inquiries',
            link: '/admin/leads',
            icon: Users,
            color: 'rose'
        },
        {
            title: 'View Patients',
            description: 'Patient records and history',
            link: '/admin/patients',
            icon: Activity,
            color: 'teal'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Premium Header */}
            <header className="glass sticky top-0 z-50 border-b border-gray-100 shadow-soft">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-violet-600" />
                            <span className="text-2xl font-['Playfair_Display'] font-bold gradient-text">
                                LifeSCC Admin
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <nav className="hidden md:flex items-center gap-2">
                                <Link to="/admin/dashboard">
                                    <Button variant="ghost" className="font-medium">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link to="/admin/appointments">
                                    <Button variant="ghost">Appointments</Button>
                                </Link>
                                <Link to="/admin/leads">
                                    <Button variant="ghost">Leads</Button>
                                </Link>
                                <Link to="/admin/patients">
                                    <Button variant="ghost">Patients</Button>
                                </Link>
                            </nav>
                            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Admin</p>
                                <p className="font-semibold text-gray-900">{user?.firstName}</p>
                            </div>
                            <Button variant="ghost" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-6 h-6 text-violet-600" />
                        <span className="text-sm font-medium text-gray-600">Analytics Dashboard</span>
                    </div>
                    <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-4 text-gray-900">
                        Clinic Performance
                    </h1>
                    <p className="text-xl text-gray-600">
                        Real-time insights into your business operations
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {keyMetrics.map((metric, index) => (
                        <div
                            key={index}
                            className={`animate-scale-in delay-${index * 100}`}
                        >
                            <Card className="hover-lift border-0 shadow-soft bg-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${metric.iconBg}`}>
                                            <metric.icon className={`w-8 h-8 ${metric.iconColor}`} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
                                            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{metric.subValue}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Appointments by Status */}
                    <Card className="shadow-soft border-0 rounded-2xl animate-fade-in">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <PieChart className="w-5 h-5 text-violet-600" />
                                <CardTitle className="font-['Playfair_Display'] text-2xl">
                                    Appointments by Status
                                </CardTitle>
                            </div>
                            <CardDescription className="text-base">
                                Current appointment distribution
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.appointmentsByStatus.map((item, index) => {
                                    const total = stats.appointmentsByStatus.reduce((sum, i) => sum + i.count, 0);
                                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

                                    return (
                                        <div key={item.status} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${APPOINTMENT_STATUS_COLORS[item.status]}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-500">{percentage}%</span>
                                                    <span className="font-bold text-lg text-gray-900">{item.count}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full gradient-primary rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leads by Status */}
                    <Card className="shadow-soft border-0 rounded-2xl animate-fade-in">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-violet-600" />
                                <CardTitle className="font-['Playfair_Display'] text-2xl">
                                    Leads by Status
                                </CardTitle>
                            </div>
                            <CardDescription className="text-base">
                                Lead conversion tracking
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.leadsByStatus.map((item, index) => {
                                    const total = stats.leadsByStatus.reduce((sum, i) => sum + i.count, 0);
                                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

                                    return (
                                        <div key={item.status} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${LEAD_STATUS_COLORS[item.status]}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray- 500">{percentage}%</span>
                                                    <span className="font-bold text-lg text-gray-900">{item.count}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full gradient-secondary rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-violet-100 rounded-lg">
                                            <Award className="w-5 h-5 text-violet-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">New this week</span>
                                    </div>
                                    <span className="text-2xl font-bold text-violet-600">{stats?.newLeads || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="mb-8">
                        <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-2 text-gray-900">
                            Quick Actions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Manage your clinic operations efficiently
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                className={`group animate-scale-in delay-${(index + 2) * 100}`}
                            >
                                <Card className="hover-lift border-0 shadow-soft bg-white h-full">
                                    <CardContent className="p-8">
                                        <div className={`inline-flex p-4 rounded-2xl ${action.color === 'violet' ? 'bg-violet-100' :
                                            action.color === 'rose' ? 'bg-rose-100' : 'bg-teal-100'
                                            } mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <action.icon className={`w-8 h-8 ${action.color === 'violet' ? 'text-violet-600' :
                                                action.color === 'rose' ? 'text-rose-600' : 'text-teal-600'
                                                }`} />
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-violet-600 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {action.description}
                                        </p>
                                        <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all">
                                            <span>Manage</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

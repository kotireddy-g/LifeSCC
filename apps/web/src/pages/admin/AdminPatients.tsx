// Simplified patients management
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPatients() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/admin/dashboard" className="text-2xl font-bold gradient-text">
                        LifeSCC Admin
                    </Link>
                </div>
            </header>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Manage Patients</h1>
                    <Link to="/admin/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Full patient management interface - To be implemented with:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                            <li>View all registered patients</li>
                            <li>Search by name, email, phone</li>
                            <li>View patient appointment history</li>
                            <li>View patient treatment records</li>
                            <li>Export patient reports</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

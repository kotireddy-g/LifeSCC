// Simplified services management
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminServices() {
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
                    <h1 className="text-3xl font-bold">Manage Services</h1>
                    <Link to="/admin/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Service Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Full service management interface - To be implemented with:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                            <li>Create new services</li>
                            <li>Edit existing services (name, price, duration, description)</li>
                            <li>Manage service categories</li>
                            <li>Assign services to branches</li>
                            <li>Enable/disable services</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

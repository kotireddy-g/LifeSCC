import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import serviceService from '@/services/service.service';
import branchService from '@/services/branch.service';
import appointmentService from '@/services/appointment.service';
import { Service, Branch } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = ['Select Service', 'Select Branch', 'Choose Date & Time', 'Confirm'];

export default function BookAppointment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Data states
    const [services, setServices] = useState<Service[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Selection states
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadServices();
        loadBranches();

        // Pre-select service from URL
        const serviceId = searchParams.get('serviceId');
        if (serviceId) {
            loadServiceById(serviceId);
        }
    }, []);

    useEffect(() => {
        if (selectedBranch && selectedDate) {
            loadAvailableSlots();
        }
    }, [selectedBranch, selectedDate]);

    const loadServices = async () => {
        try {
            const response = await serviceService.getAllServices();
            if (response.success && response.data) {
                setServices(response.data.services);
            }
        } catch (error) {
            toast.error('Failed to load services');
        }
    };

    const loadServiceById = async (id: string) => {
        const service = services.find(s => s.id === id);
        if (service) {
            setSelectedService(service);
            setCurrentStep(1);
        }
    };

    const loadBranches = async () => {
        try {
            const response = await branchService.getAllBranches();
            if (response.success && response.data) {
                setBranches(response.data.branches);
            }
        } catch (error) {
            toast.error('Failed to load branches');
        }
    };

    const loadAvailableSlots = async () => {
        if (!selectedBranch || !selectedDate) return;

        setLoading(true);
        try {
            const response = await branchService.getAvailableSlots(
                selectedBranch.id,
                selectedDate,
                selectedService?.id
            );
            if (response.success && response.data) {
                setAvailableSlots(response.data.availableSlots);
            }
        } catch (error) {
            toast.error('Failed to load time slots');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 0 && !selectedService) {
            toast.error('Please select a service');
            return;
        }
        if (currentStep === 1 && !selectedBranch) {
            toast.error('Please select a branch');
            return;
        }
        if (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) {
            toast.error('Please select date and time');
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleBooking = async () => {
        if (!selectedService || !selectedBranch || !selectedDate || !selectedTimeSlot || !user) {
            toast.error('Please complete all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await appointmentService.createAppointment({
                serviceId: selectedService.id,
                branchId: selectedBranch.id,
                appointmentDate: selectedDate,
                timeSlot: selectedTimeSlot,
                patientName: `${user.firstName} ${user.lastName}`,
                patientPhone: user.phone || '',
                patientEmail: user.email,
                notes
            });

            if (response.success) {
                toast.success('Appointment booked successfully!');
                navigate('/patient/appointments');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/patient/dashboard" className="text-2xl font-bold gradient-text">
                        LifeSCC
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
                    <p className="text-muted-foreground">Follow the steps to schedule your treatment</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index <= currentStep
                                                ? 'bg-primary text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                                    </div>
                                    <span className="text-xs mt-2 text-center">{step}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{STEPS[currentStep]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Select Service */}
                        {currentStep === 0 && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {services.map((service) => (
                                    <Card
                                        key={service.id}
                                        className={`cursor-pointer transition ${selectedService?.id === service.id
                                                ? 'border-primary ring-2 ring-primary'
                                                : 'hover:border-primary'
                                            }`}
                                        onClick={() => setSelectedService(service)}
                                    >
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2">{service.name}</h3>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>⏱️ {service.duration} minutes</p>
                                                <p className="font-medium text-primary">
                                                    {formatCurrency(service.discountPrice || service.price)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Select Branch */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                {branches.map((branch) => (
                                    <Card
                                        key={branch.id}
                                        className={`cursor-pointer transition ${selectedBranch?.id === branch.id
                                                ? 'border-primary ring-2 ring-primary'
                                                : 'hover:border-primary'
                                            }`}
                                        onClick={() => setSelectedBranch(branch)}
                                    >
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2">{branch.name}</h3>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>📍 {branch.address}, {branch.city}</p>
                                                <p>📞 {branch.phone}</p>
                                                <p>🕒 {branch.openingTime} - {branch.closingTime}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Step 3: Select Date & Time */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="date">Select Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedTimeSlot('');
                                        }}
                                        className="mt-2"
                                    />
                                </div>

                                {selectedDate && (
                                    <div>
                                        <Label>Available Time Slots</Label>
                                        {loading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <p className="text-sm text-muted-foreground mt-2">No slots available for this date</p>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2 mt-2">
                                                {availableSlots.map((slot) => (
                                                    <Button
                                                        key={slot}
                                                        variant={selectedTimeSlot === slot ? 'default' : 'outline'}
                                                        onClick={() => setSelectedTimeSlot(slot)}
                                                        className="w-full"
                                                    >
                                                        {slot}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Confirm */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="bg-muted p-4 rounded-lg space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Service:</span>
                                        <p className="font-semibold">{selectedService?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Branch:</span>
                                        <p className="font-semibold">{selectedBranch?.name}</p>
                                        <p className="text-sm">{selectedBranch?.address}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Date & Time:</span>
                                        <p className="font-semibold">
                                            {formatDate(selectedDate, 'PPP')} at {selectedTimeSlot}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Price:</span>
                                        <p className="font-semibold text-primary text-lg">
                                            {formatCurrency(selectedService?.discountPrice || selectedService?.price || 0)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Any special requests or requirements..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>

                            {currentStep < STEPS.length - 1 ? (
                                <Button onClick={handleNext}>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={handleBooking} disabled={loading}>
                                    {loading ? 'Booking...' : 'Confirm Booking'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

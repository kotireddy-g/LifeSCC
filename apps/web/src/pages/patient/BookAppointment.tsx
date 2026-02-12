import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, Phone, Calendar, Scissors, DollarSign, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import serviceService from '@/services/service.service';
import branchService from '@/services/branch.service';
import appointmentService from '@/services/appointment.service';
import { Service, Branch } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = ['Select Service', 'Select Branch', 'Choose Date & Time', 'Confirm'];

export default function BookAppointment() {
    const { user, logout } = useAuth();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/patient/dashboard" className="text-2xl font-bold font-['Poppins'] bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
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
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Book Appointment
                    </h1>
                    <p className="text-gray-600 text-lg">Follow the steps to schedule your treatment</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${index <= currentStep
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200 scale-110'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                                    </div>
                                    <span className={`text-xs mt-2 text-center font-medium ${index <= currentStep ? 'text-violet-600' : 'text-gray-400'}`}>
                                        {step}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-100">
                                        <div
                                            className={`h-full transition-all duration-500 ${index < currentStep ? 'bg-gradient-to-r from-violet-600 to-purple-600 w-full' : 'w-0'
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="shadow-soft border-0 bg-white/90 backdrop-blur overflow-hidden">
                    {/* Gradient Accent Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-['Poppins'] flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-violet-600" />
                            {STEPS[currentStep]}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* Step 1: Select Service */}
                        {currentStep === 0 && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {services.map((service) => (
                                    <Card
                                        key={service.id}
                                        className={`cursor-pointer transition-all duration-300 hover-lift bg-white/90 backdrop-blur border-l-4 ${selectedService?.id === service.id
                                                ? 'border-l-violet-600 ring-2 ring-violet-200 shadow-lg'
                                                : 'border-l-gray-200 hover:border-l-violet-400'
                                            }`}
                                        onClick={() => setSelectedService(service)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                    <Scissors className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="h-4 w-4 mr-1.5 text-violet-500" />
                                                            {service.duration} minutes
                                                        </div>
                                                        <p className="font-semibold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                                            {formatCurrency(service.discountPrice || service.price)}
                                                        </p>
                                                    </div>
                                                </div>
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
                                        className={`cursor-pointer transition-all duration-300 hover-lift bg-white/90 backdrop-blur border-l-4 ${selectedBranch?.id === branch.id
                                                ? 'border-l-violet-600 ring-2 ring-violet-200 shadow-lg'
                                                : 'border-l-gray-200 hover:border-l-violet-400'
                                            }`}
                                        onClick={() => setSelectedBranch(branch)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{branch.name}</h3>
                                                    <div className="text-sm text-gray-600 space-y-1.5">
                                                        <div className="flex items-start gap-1.5">
                                                            <MapPin className="h-4 w-4 mt-0.5 text-violet-500 flex-shrink-0" />
                                                            <span>{branch.address}, {branch.city}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="h-4 w-4 text-violet-500" />
                                                            <span>{branch.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-4 w-4 text-violet-500" />
                                                            <span>{branch.openingTime} - {branch.closingTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                    <Label htmlFor="date" className="flex items-center gap-2 text-base font-semibold mb-3">
                                        <Calendar className="h-5 w-5 text-violet-600" />
                                        Select Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedTimeSlot('');
                                        }}
                                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                                    />
                                </div>

                                {selectedDate && (
                                    <div>
                                        <Label className="flex items-center gap-2 text-base font-semibold mb-3">
                                            <Clock className="h-5 w-5 text-violet-600" />
                                            Available Time Slots
                                        </Label>
                                        {loading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="relative">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200"></div>
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-violet-600 absolute top-0"></div>
                                                </div>
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                                                    <Clock className="h-8 w-8 text-violet-600" />
                                                </div>
                                                <p className="text-gray-600">No slots available for this date</p>
                                                <p className="text-sm text-gray-500 mt-1">Please select a different date</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                                {availableSlots.map((slot) => (
                                                    <Button
                                                        key={slot}
                                                        variant={selectedTimeSlot === slot ? 'default' : 'outline'}
                                                        onClick={() => setSelectedTimeSlot(slot)}
                                                        className={`w-full transition-all duration-300 ${selectedTimeSlot === slot
                                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-200 scale-105'
                                                                : 'hover:border-violet-400 hover:text-violet-600'
                                                            }`}
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
                                <Card className="border-0 shadow-soft overflow-hidden">
                                    <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                                    <CardContent className="p-6 bg-gradient-to-br from-violet-50/50 to-purple-50/50 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                <Scissors className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Service</span>
                                                <p className="font-semibold text-gray-900 text-lg">{selectedService?.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Branch</span>
                                                <p className="font-semibold text-gray-900">{selectedBranch?.name}</p>
                                                <p className="text-sm text-gray-600">{selectedBranch?.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Date & Time</span>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(selectedDate, 'PPP')} at {selectedTimeSlot}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 pt-3 border-t border-violet-200">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                                <DollarSign className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Total Price</span>
                                                <p className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                    {formatCurrency(selectedService?.discountPrice || selectedService?.price || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div>
                                    <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
                                        Additional Notes (Optional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any special requests or requirements..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="min-h-[100px] border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="hover:border-violet-400 hover:text-violet-600 transition-all"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>

                            {currentStep < STEPS.length - 1 ? (
                                <Button
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-200 transition-all"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleBooking}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-200 transition-all min-w-[160px]"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Booking...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Confirm Booking
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

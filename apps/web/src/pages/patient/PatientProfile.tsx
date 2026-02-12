import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Mail, Phone, Calendar, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function PatientProfile() {
    const { user, updateProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            dateOfBirth: user?.dateOfBirth || '',
            gender: user?.gender || '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            pincode: user?.pincode || ''
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
                gender: user.gender || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                pincode: user.pincode || ''
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileForm) => {
        setIsSaving(true);
        try {
            await updateProfile(data);
            setIsEditing(false);
        } catch (error) {
            // Error handled by context
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />

            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/patient/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-bold gradient-text">LifeSCC</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/patient/dashboard">
                                <Button variant="ghost" size="sm" className="hover:bg-violet-50">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-violet-50">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your personal information
                    </p>
                </div>

                {/* Profile Header Card */}
                <Card className="mb-8 border-0 shadow-soft bg-white/90 backdrop-blur overflow-hidden hover-lift transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-200">
                                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-4 border-white flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-gray-600 mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${user?.isVerified
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                        }`}>
                                        {user?.isVerified ? '✓ Verified' : '⚠ Not Verified'}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Member since {user?.createdAt ? formatDate(user.createdAt, 'MMM yyyy') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Form Card */}
                <Card className="border-0 shadow-soft bg-white/90 backdrop-blur overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Personal Information</h3>
                                <p className="text-gray-600">Update your personal details</p>
                            </div>
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-200 hover-lift"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <User className="h-4 w-4 text-violet-600" />
                                            First Name *
                                        </Label>
                                        <Input
                                            id="firstName"
                                            {...register('firstName')}
                                            disabled={!isEditing}
                                            className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="font-medium">⚠</span> {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <User className="h-4 w-4 text-violet-600" />
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="lastName"
                                            {...register('lastName')}
                                            disabled={!isEditing}
                                            className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <span className="font-medium">⚠</span> {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-violet-600" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={user?.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span>🔒</span> Email cannot be changed
                                    </p>
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-violet-600" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        {...register('phone')}
                                        disabled={!isEditing}
                                        placeholder="+91 98765 43210"
                                        className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                    />
                                </div>

                                {/* Date of Birth & Gender */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-violet-600" />
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            {...register('dateOfBirth')}
                                            disabled={!isEditing}
                                            className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-gray-700 font-semibold flex items-center gap-2">
                                            <User className="h-4 w-4 text-violet-600" />
                                            Gender
                                        </Label>
                                        <select
                                            id="gender"
                                            {...register('gender')}
                                            disabled={!isEditing}
                                            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-violet-200 focus-visible:ring-violet-400'} transition-all duration-200`}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-violet-600" />
                                        Address Information
                                    </h4>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-gray-700 font-semibold">
                                                Street Address
                                            </Label>
                                            <Input
                                                id="address"
                                                {...register('address')}
                                                disabled={!isEditing}
                                                placeholder="Street address"
                                                className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-gray-700 font-semibold">
                                                    City
                                                </Label>
                                                <Input
                                                    id="city"
                                                    {...register('city')}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="text-gray-700 font-semibold">
                                                    State
                                                </Label>
                                                <Input
                                                    id="state"
                                                    {...register('state')}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="pincode" className="text-gray-700 font-semibold">
                                                    Pincode
                                                </Label>
                                                <Input
                                                    id="pincode"
                                                    {...register('pincode')}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? 'bg-gray-50' : 'bg-white border-violet-200 focus:border-violet-400 focus:ring-violet-400'} transition-all duration-200`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-200 hover-lift"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

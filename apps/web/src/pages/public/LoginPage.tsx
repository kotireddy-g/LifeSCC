import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LogIn, Mail, Lock, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            // Success toast and navigation are handled by AuthContext
        } catch (error: any) {
            // Error toast is already shown by AuthContext, no need to duplicate
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const demoCredentials = [
        { role: 'Admin', email: 'admin@lifescc.com', password: 'Admin@123' },
        { role: 'Patient', email: 'ananya.reddy@gmail.com', password: 'Admin@123' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding */}
                    <div className="hidden lg:block animate-slide-in-left">
                        <Link to="/" className="inline-flex items-center gap-3 mb-8">
                            <Sparkles className="h-12 w-12 text-violet-600" />
                            <span className="text-4xl font-['Playfair_Display'] font-bold gradient-text">
                                LifeSCC
                            </span>
                        </Link>

                        <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-6 text-gray-900">
                            Welcome Back to Your
                            <span className="gradient-text block">Beauty Journey</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Access your appointments, treatment history, and personalized recommendations all in one place.
                        </p>

                        {/* Trust Indicators */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg gradient-primary">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Secure & Private</p>
                                    <p className="text-sm text-gray-600">Your data is protected with industry-standard encryption</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg gradient-secondary">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Personalized Care</p>
                                    <p className="text-sm text-gray-600">Tailored treatment plans just for you</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <Card className="shadow-premium border-0 rounded-3xl bg-white/95 backdrop-blur-lg animate-fade-in">
                        <CardHeader className="space-y-1 pb-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-3xl font-['Playfair_Display'] font-bold">
                                    Sign In
                                </CardTitle>
                                <Link to="/" className="lg:hidden">
                                    <Sparkles className="h-8 w-8 text-violet-600" />
                                </Link>
                            </div>
                            <CardDescription className="text-base">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            {...register('email')}
                                            className="pl-11 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-semibold">
                                            Password
                                        </Label>
                                        <button
                                            type="button"
                                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                        >
                                            Forgot?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            {...register('password')}
                                            className="pl-11 pr-11 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base rounded-xl btn-primary mt-6"
                                >
                                    {isLoading ? (
                                        'Signing in...'
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            <span>Sign In</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700">
                                        Create Account
                                    </Link>
                                </p>
                            </div>

                            {/* Demo Credentials */}
                            <div className="mt-8 p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-sm font-semibold text-violet-900 mb-3">Demo Credentials:</p>
                                <div className="space-y-2">
                                    {demoCredentials.map((cred, index) => (
                                        <div key={index} className="text-xs space-y-1">
                                            <p className="font-medium text-violet-800">{cred.role}:</p>
                                            <p className="text-violet-700 font-mono">{cred.email}</p>
                                            <p className="text-violet-700 font-mono">{cred.password}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

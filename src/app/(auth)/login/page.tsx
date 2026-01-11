'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

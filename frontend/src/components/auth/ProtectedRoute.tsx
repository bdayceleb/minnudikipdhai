'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: 'ADMIN' | 'USER' }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            checkAuth();
        }
    }, [isAuthenticated, isLoading, checkAuth]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                if (pathname !== '/login') {
                    router.push('/login');
                }
            } else if (requireRole && user?.role !== requireRole) {
                // Logged in but wrong role - send to their respective dashboard
                if (user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            }
        }
    }, [isLoading, isAuthenticated, user, requireRole, router, pathname]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    // Only render children if constraints met
    if (isAuthenticated && (!requireRole || user?.role === requireRole)) {
        return <>{children}</>;
    }

    return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: 'ADMIN' | 'USER' }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const pathname = usePathname();
    const hasChecked = useRef(false);

    // Always check auth on mount
    useEffect(() => {
        if (!hasChecked.current) {
            hasChecked.current = true;
            checkAuth();
        }
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                if (pathname !== '/login') {
                    router.push('/login');
                }
            } else if (requireRole && user?.role !== requireRole) {
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
            <div className="flex items-center justify-center min-h-screen bg-rose-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (isAuthenticated && (!requireRole || user?.role === requireRole)) {
        return <>{children}</>;
    }

    return null;
}

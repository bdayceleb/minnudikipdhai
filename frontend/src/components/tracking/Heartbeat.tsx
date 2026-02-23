'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function Heartbeat() {
    const pathname = usePathname();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const sessionId = useAuthStore((state) => state.sessionId);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !sessionId) return;

        const startHeartbeat = () => {
            // Clear existing
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(async () => {
                try {
                    // Send 10s increment
                    await api.post('/tracking/heartbeat', {
                        pageName: pathname,
                        timeSpentSeconds: 10,
                    });
                } catch (e) {
                    console.error('Failed to send heartbeat');
                }
            }, 10000);
        };

        startHeartbeat();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAuthenticated, sessionId, pathname]);

    return null; // Silent component
}

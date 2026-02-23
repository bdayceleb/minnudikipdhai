import { create } from 'zustand';
import api from '../lib/api';

interface User {
    id: string;
    name: string;
    username: string;
    role: 'ADMIN' | 'USER';
}

interface AuthState {
    user: User | null;
    sessionId: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, sessionId: string) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    sessionId: null,
    isAuthenticated: false,
    isLoading: true,

    login: (user, sessionId) => {
        set({ user, sessionId, isAuthenticated: true });
        if (typeof window !== 'undefined') {
            localStorage.setItem('sessionId', sessionId);
        }
    },

    logout: async () => {
        const { sessionId } = get();
        try {
            await api.post('/auth/logout', { sessionId });
        } catch (e) {
            console.error('Logout failed:', e);
        } finally {
            set({ user: null, sessionId: null, isAuthenticated: false });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('sessionId');
            }
            // Redirect to home
            window.location.href = '/';
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/auth/me');
            const savedSessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
            set({ user: data, isAuthenticated: true, sessionId: savedSessionId, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, sessionId: null, isLoading: false });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('sessionId');
            }
        }
    }
}));

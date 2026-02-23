'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.user, data.sessionId);

            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 relative overflow-hidden">
            {/* Background Hearts */}
            <div className="absolute top-10 left-10 text-pink-200 opacity-50 text-6xl animate-pulse">❤️</div>
            <div className="absolute bottom-20 right-20 text-purple-200 opacity-50 text-8xl animate-bounce">💖</div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-500">I promise to push the bar even higher.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all bg-white/50"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all bg-white/50"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-md shadow-pink-200 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Logging in...' : 'Enter the Portal'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

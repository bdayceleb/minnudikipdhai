'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated, user, checkAuth, isLoading: isAuthLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            checkAuth();
        }
    }, [isAuthenticated, checkAuth]);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') router.push('/admin');
            else router.push('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/login', { username, password });
            login(data.user, data.sessionId);

            if (data.user?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
            setIsLoading(false);
        }
    };

    if (isAuthLoading || isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col justify-center relative overflow-hidden selection:bg-rose-500/30">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="text-rose-950 flex items-center gap-2 font-bold tracking-tight opacity-70 hover:opacity-100 transition-opacity">
                    <HeartHandshake className="text-rose-500" size={24} />
                    Minu Ki Pdhai
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-2xl py-10 px-6 sm:px-12 rounded-3xl border border-rose-100 shadow-2xl shadow-rose-900/5"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-rose-950 mb-2">Welcome Back</h2>
                        <p className="text-sm text-rose-500 font-medium">
                            Enter our world to continue the journey.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-rose-950 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-rose-300" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-rose-100 rounded-xl leading-5 bg-white text-rose-950 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-rose-950 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-rose-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-rose-100 rounded-xl leading-5 bg-white text-rose-950 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-200 text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-[0_8px_30px_rgb(225,29,72,0.2)] text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Enter
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

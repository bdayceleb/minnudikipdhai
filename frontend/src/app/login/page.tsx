'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore(state => state.login);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            const user = useAuthStore.getState().user;
            if (user?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col justify-center relative overflow-hidden selection:bg-rose-500/30">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="text-white flex items-center gap-2 font-bold tracking-tight opacity-70 hover:opacity-100 transition-opacity">
                    <HeartHandshake className="text-rose-500" size={24} />
                    Push The Bar
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-2xl py-10 px-6 sm:px-12 rounded-3xl border border-white/10 shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
                        <p className="text-sm text-neutral-400 font-light">
                            Enter your credentials to continue the journey.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-neutral-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-neutral-800 rounded-xl leading-5 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-neutral-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-neutral-800 rounded-xl leading-5 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
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
                                className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-rose-500/20 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-neutral-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Sign In
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

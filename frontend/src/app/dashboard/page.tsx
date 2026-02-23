'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import LectureCard from '../../components/LectureCard';
import { motion } from 'framer-motion';
import { LogOut, Activity, Flame, BookOpen, ArrowLeft, Loader2, Sparkles, HeartHandshake } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface StatData {
    totalTimeSeconds: number;
    todayTimeSeconds: number;
    weeklyChart: any[];
}

interface Lecture {
    id: string;
    title: string;
    description: string;
    is_published: boolean;
    created_at: string;
}

export default function UserDashboard() {
    const { user, logout } = useAuthStore();
    const [stats, setStats] = useState<StatData | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLecture, setSelectedLecture] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, lecturesRes] = await Promise.all([
                    api.get('/analytics/user'),
                    api.get('/lectures')
                ]);

                const formattedChart = statsRes.data.weeklyChart.map((d: any) => ({
                    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    hours: Number((d.total_time_seconds / 3600).toFixed(2))
                }));

                setStats({ ...statsRes.data, weeklyChart: formattedChart });
                setLectures(lecturesRes.data);
            } catch (e) {
                console.error('Failed to load dashboard', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openLecture = async (id: string) => {
        try {
            const { data } = await api.get(`/lectures/${id}`);
            setSelectedLecture(data);
        } catch (error) {
            console.error('Error fetching lecture content', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-neutral-400">
                    <Loader2 className="animate-spin text-rose-500" size={32} />
                    <p className="font-light tracking-wide">Syncing data...</p>
                </div>
            </div>
        );
    }

    const totalHours = stats ? (stats.totalTimeSeconds / 3600).toFixed(1) : '0';
    const todayHours = stats ? (stats.todayTimeSeconds / 3600).toFixed(1) : '0';
    const sleepHours = stats ? Math.min((stats.todayTimeSeconds / 1800), 8).toFixed(1) : '0';

    return (
        <ProtectedRoute requireRole="USER">
            <div className="min-h-screen bg-neutral-950 text-neutral-200 p-4 md:p-8 font-sans selection:bg-rose-500/30 overflow-x-hidden relative">
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white/5 backdrop-blur-xl p-6 md:px-10 rounded-3xl border border-white/10 shadow-2xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                <HeartHandshake size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">Welcome, {user?.name}</h1>
                                <p className="text-neutral-400 text-sm font-light">Let's push the bar higher today.</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Stats */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Gamification Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <Activity className="text-rose-400" size={24} />
                                    <h2 className="text-xl font-bold text-white tracking-tight">Today's Protocol</h2>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    {/* User Meter */}
                                    <div>
                                        <div className="flex justify-between mb-3 text-sm font-medium">
                                            <span className="text-neutral-400 uppercase tracking-wider text-xs">Your Focus</span>
                                            <span className="text-rose-400">{todayHours} / 4 hrs</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}
                                                className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    {/* Admin Sleep Meter */}
                                    <div>
                                        <div className="flex justify-between mb-3 text-sm font-medium">
                                            <span className="text-neutral-400 uppercase tracking-wider text-xs">His Rest</span>
                                            <span className="text-indigo-400">{sleepHours} / 8 hrs</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}
                                                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                        <p className="text-neutral-400 italic text-sm font-light">
                                            {Number(todayHours) >= 2
                                                ? "Systems optimized. I am resting peacefully. ❤️"
                                                : "Deficit detected. Please increase focus time. 🥺"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Total Stats */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                                <h3 className="font-semibold text-neutral-300 tracking-tight flex items-center gap-2 mb-6">
                                    <Flame className="text-orange-500" size={20} /> Overall Journey
                                </h3>

                                <div className="flex items-end gap-2 mb-8">
                                    <span className="text-6xl font-bold text-white tracking-tighter">
                                        {totalHours}
                                    </span>
                                    <span className="text-neutral-500 font-medium pb-2 uppercase text-xs tracking-widest">Hours</span>
                                </div>

                                <div className="h-48 mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats?.weeklyChart}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dx={-10} />
                                            <Tooltip
                                                cursor={{ stroke: '#f43f5e', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="hours" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#18181b', strokeWidth: 2, stroke: '#f43f5e' }} activeDot={{ r: 6, fill: '#f43f5e' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Lectures & Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {selectedLecture ? (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-xl min-h-[600px]">
                                    <button onClick={() => setSelectedLecture(null)} className="mb-8 flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm tracking-wide font-medium transition-colors group">
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
                                    </button>
                                    <div className="prose prose-invert prose-rose max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-8 prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:font-light prose-strong:text-white">
                                        <h1>{selectedLecture.title}</h1>
                                        <div dangerouslySetInnerHTML={{ __html: selectedLecture.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl shadow-xl min-h-[600px]">
                                    <div className="mb-10">
                                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                            <BookOpen className="text-indigo-400" size={28} /> Study Material
                                        </h2>
                                        <p className="text-neutral-400 mt-2 font-light">Unlock modules and push the bar.</p>
                                    </div>

                                    {lectures.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-16 text-center bg-white/5 rounded-2xl border border-dashed border-white/20">
                                            <Sparkles className="text-neutral-500 mb-4" size={32} />
                                            <p className="text-neutral-400 font-medium">No files accessible yet.<br />Awaiting secure transmission from Admin.</p>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {lectures.map((lecture) => (
                                                <LectureCard key={lecture.id} lecture={lecture} onClick={() => openLecture(lecture.id)} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

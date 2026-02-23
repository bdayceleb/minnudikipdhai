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
            <div className="min-h-screen bg-rose-50 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-rose-400">
                    <Loader2 className="animate-spin text-rose-500" size={32} />
                    <p className="font-medium tracking-wide">Syncing our world...</p>
                </div>
            </div>
        );
    }

    const totalHours = stats ? (stats.totalTimeSeconds / 3600).toFixed(1) : '0';
    const todayHours = stats ? (stats.todayTimeSeconds / 3600).toFixed(1) : '0';
    const sleepHours = stats ? Math.min((stats.todayTimeSeconds / 1800), 8).toFixed(1) : '0';

    return (
        <ProtectedRoute requireRole="USER">
            <div className="min-h-screen bg-[#fff5f6] text-rose-950 p-4 md:p-8 font-sans selection:bg-rose-500/30 overflow-x-hidden relative">
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white/60 backdrop-blur-xl p-6 md:px-10 rounded-3xl border border-rose-100 shadow-xl shadow-rose-900/5 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner">
                                <HeartHandshake size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-rose-950">Welcome, {user?.name}</h1>
                                <p className="text-rose-500 text-sm font-medium">Let's build our future today.</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-white bg-white hover:bg-rose-500 border border-rose-100 hover:border-transparent rounded-full transition-all shadow-sm"
                        >
                            <LogOut size={16} /> Disconnect
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Stats */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Gamification Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white/80 border border-rose-100 rounded-3xl p-8 shadow-xl shadow-rose-900/5 relative overflow-hidden backdrop-blur-md"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <Activity className="text-rose-500" size={24} />
                                    <h2 className="text-xl font-bold text-rose-950 tracking-tight">Today's Protocol</h2>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    {/* User Meter */}
                                    <div>
                                        <div className="flex justify-between mb-3 text-sm font-bold">
                                            <span className="text-rose-400 uppercase tracking-widest text-[10px]">Your Focus</span>
                                            <span className="text-rose-600">{todayHours} <span className="text-rose-400 font-medium">/ 4 hrs</span></span>
                                        </div>
                                        <div className="h-2.5 w-full bg-rose-100 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}
                                                className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Admin Sleep Meter */}
                                    <div>
                                        <div className="flex justify-between mb-3 text-sm font-bold">
                                            <span className="text-indigo-400 uppercase tracking-widest text-[10px]">His Rest</span>
                                            <span className="text-indigo-600">{sleepHours} <span className="text-indigo-400 font-medium">/ 8 hrs</span></span>
                                        </div>
                                        <div className="h-2.5 w-full bg-indigo-50 rounded-full overflow-hidden shadow-inner border border-indigo-100/50">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}
                                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 text-center">
                                        <p className="text-rose-600 italic text-sm font-medium">
                                            {Number(todayHours) >= 2
                                                ? "Systems optimized. I am resting peacefully. ❤️"
                                                : "Deficit detected. Please increase focus time. 🥺"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Total Stats */}
                            <div className="bg-white/80 backdrop-blur-md border border-rose-100 p-8 rounded-3xl shadow-xl shadow-rose-900/5">
                                <h3 className="font-semibold text-rose-900 tracking-tight flex items-center gap-2 mb-6">
                                    <Flame className="text-orange-500" size={20} /> Overall Journey
                                </h3>

                                <div className="flex items-end gap-2 mb-8">
                                    <span className="text-6xl font-black text-rose-950 tracking-tighter">
                                        {totalHours}
                                    </span>
                                    <span className="text-rose-400 font-bold pb-2 uppercase text-xs tracking-widest">Hours</span>
                                </div>

                                <div className="h-48 mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats?.weeklyChart}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffe4e6" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#fb7185' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#fb7185' }} dx={-10} />
                                            <Tooltip
                                                cursor={{ stroke: '#fda4af', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                contentStyle={{ backgroundColor: '#fff', borderColor: '#ffe4e6', borderRadius: '12px', color: '#4c0519', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="hours" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#f43f5e' }} activeDot={{ r: 6, fill: '#f43f5e' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Lectures & Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {selectedLecture ? (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/90 backdrop-blur-xl border border-rose-100 p-8 md:p-12 rounded-3xl shadow-xl shadow-rose-900/5 min-h-[600px]">
                                    <button onClick={() => setSelectedLecture(null)} className="mb-8 flex items-center gap-2 text-rose-500 hover:text-rose-600 text-sm tracking-wide font-bold transition-colors group">
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
                                    </button>
                                    <div className="prose prose-rose max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-8 prose-p:text-rose-900/80 prose-p:leading-relaxed prose-strong:text-rose-950">
                                        <h1>{selectedLecture.title}</h1>
                                        <div dangerouslySetInnerHTML={{ __html: selectedLecture.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white/80 backdrop-blur-xl border border-rose-100 p-8 md:p-10 rounded-3xl shadow-xl shadow-rose-900/5 min-h-[600px]">
                                    <div className="mb-10">
                                        <h2 className="text-2xl font-bold text-rose-950 tracking-tight flex items-center gap-3">
                                            <BookOpen className="text-rose-500" size={28} /> Study Material
                                        </h2>
                                        <p className="text-rose-500 mt-2 font-medium">Unlock modules and push the bar.</p>
                                    </div>

                                    {lectures.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-16 text-center bg-rose-50/50 rounded-2xl border border-dashed border-rose-200">
                                            <Sparkles className="text-rose-300 mb-4" size={32} />
                                            <p className="text-rose-400 font-medium">No files accessible yet.<br />Awaiting secure transmission from Admin.</p>
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

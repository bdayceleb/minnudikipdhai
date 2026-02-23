'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import LectureCard from '../../components/LectureCard';
import { motion } from 'framer-motion';
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

    // For viewing lecture content
    const [selectedLecture, setSelectedLecture] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, lecturesRes] = await Promise.all([
                    api.get('/analytics/user'),
                    api.get('/lectures')
                ]);

                // Format chart data
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your world...</div>;

    const totalHours = stats ? (stats.totalTimeSeconds / 3600).toFixed(1) : '0';
    const todayHours = stats ? (stats.todayTimeSeconds / 3600).toFixed(1) : '0';

    return (
        <ProtectedRoute requireRole="USER">
            <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome, {user?.name} 💖</h1>
                        <p className="text-gray-500 mt-1">Let's push the bar higher today.</p>
                    </div>
                    <button onClick={logout} className="px-5 py-2 text-sm text-rose-500 font-medium bg-rose-50 hover:bg-rose-100 rounded-full transition-colors">
                        Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Gamification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <h2 className="text-xl font-bold mb-6">Today's Progress</h2>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex justify-between mb-2 text-indigo-100 text-sm font-medium">
                                        <span>Your Study Hours</span>
                                        <span>{todayHours} / 4 hrs</span>
                                    </div>
                                    <div className="h-3 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-400 rounded-full" style={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2 text-indigo-100 text-sm font-medium">
                                        <span>His Peace/Sleep</span>
                                        <span>{(stats?.todayTimeSeconds || 0) / 1800 >= 8 ? 8 : ((stats?.todayTimeSeconds || 0) / 1800).toFixed(1)} / 8 hrs</span>
                                    </div>
                                    <div className="h-3 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min((stats?.todayTimeSeconds || 0) / (4 * 3600) * 100, 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 text-center mt-4">
                                    <p className="text-indigo-50 leading-relaxed font-light text-sm">
                                        {Number(todayHours) >= 2
                                            ? "I am sleeping so peacefully right now. Thank you. ❤️"
                                            : "Please study... I'm getting anxious. 🥺"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Total Stats */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                            <h3 className="font-semibold text-gray-700 mb-6 flex items-center gap-2">
                                <span className="text-2xl">📈</span> Overall Journey
                            </h3>
                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                                    {totalHours}
                                </span>
                                <span className="text-gray-400 font-medium mb-1">Hours</span>
                            </div>

                            <div className="h-48 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats?.weeklyChart}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <Tooltip cursor={{ stroke: '#f472b6', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="hours" stroke="#f472b6" strokeWidth={3} dot={{ r: 4, fill: '#f472b6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Lectures & Content (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedLecture ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100 min-h-[600px]">
                                <button onClick={() => setSelectedLecture(null)} className="mb-6 flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium transition-colors">
                                    ← Back to Library
                                </button>
                                <div className="prose prose-pink max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-8 prose-p:text-gray-600 prose-p:leading-relaxed">
                                    <h1>{selectedLecture.title}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: selectedLecture.content.replace(/\n/g, '<br/>') }} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 min-h-[600px]">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <span className="text-3xl">📚</span> Your Study Material
                                        </h2>
                                        <p className="text-gray-500 mt-1">Unlock modules and push higher.</p>
                                    </div>
                                </div>

                                {lectures.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="text-4xl mb-4">🤫</div>
                                        <p className="text-gray-500 font-medium">No chapters released yet.<br />The Admin is preparing something special.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {lectures.map((lecture) => (
                                            <LectureCard key={lecture.id} lecture={lecture} onClick={openLecture} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

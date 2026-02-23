'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import LectureCard from '../../components/LectureCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

interface AdminStats {
    totalTimeSeconds: number;
    todayTimeSeconds: number;
    weeklyChart: any[];
    recentSessions: any[];
    pageActivity: any[];
}

interface Lecture {
    id: string;
    title: string;
    description: string;
    is_published: boolean;
    created_at: string;
    content: string;
}

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [editingLecture, setEditingLecture] = useState<Partial<Lecture> | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, lecturesRes] = await Promise.all([
                api.get('/analytics/admin'),
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

    const handleSaveLecture = async () => {
        try {
            if (editingLecture?.id) {
                await api.put(`/lectures/${editingLecture.id}`, editingLecture);
            } else {
                await api.post('/lectures', editingLecture);
            }
            setEditingLecture(null);
            await fetchData();
        } catch (error) {
            console.error('Error saving lecture', error);
            alert('Failed to save lecture');
        }
    };

    const openEditor = async (id?: string) => {
        if (id) {
            const { data } = await api.get(`/lectures/${id}`);
            setEditingLecture(data);
        } else {
            setEditingLecture({ title: '', description: '', content: '', is_published: false });
        }
    };

    const deleteLecture = async (id: string) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            await api.delete(`/lectures/${id}`);
            await fetchData();
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Control Center...</div>;

    const totalHours = stats ? (stats.totalTimeSeconds / 3600).toFixed(1) : '0';
    const todayHours = stats ? (stats.todayTimeSeconds / 3600).toFixed(1) : '0';

    return (
        <ProtectedRoute requireRole="ADMIN">
            <div className="min-h-screen bg-gray-50 p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider uppercase text-pink-400">Admin Control Center</h1>
                        <p className="text-gray-400 mt-1">Monitoring ({user?.name})</p>
                    </div>
                    <button onClick={logout} className="px-5 py-2 text-sm text-white font-medium bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
                        Disconnect
                    </button>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Main Left - Analytics (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* KPI Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <span className="text-gray-500 font-medium text-sm uppercase">Total Hours Studied</span>
                                <span className="text-4xl font-black text-gray-800 mt-2">{totalHours}</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <span className="text-gray-500 font-medium text-sm uppercase">Today's Focus</span>
                                <span className="text-4xl font-black text-pink-500 mt-2">{todayHours} hrs</span>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-md border border-indigo-800">
                                <span className="text-indigo-200 font-medium text-sm uppercase block mb-2">Sleep Logic Meter</span>
                                <div className="flex items-end gap-2 text-3xl font-bold">
                                    {(Number(todayHours) * 2).toFixed(1)} <span className="text-lg font-normal text-indigo-300">hrs rest</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Activity Trend</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.weeklyChart}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px' }} />
                                        <Bar dataKey="hours" fill="#f472b6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Content Management */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100" id="content-mgmt">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Content Management</h3>
                                <button
                                    onClick={() => openEditor()}
                                    className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors shadow-sm"
                                >
                                    + Create Lecture
                                </button>
                            </div>

                            {editingLecture ? (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="flex justify-between mb-4">
                                        <h4 className="font-semibold text-gray-700">{editingLecture.id ? 'Edit Lecture' : 'New Lecture'}</h4>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingLecture(null)} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-200 rounded-md">Cancel</button>
                                            {editingLecture.id && <button onClick={() => deleteLecture(editingLecture.id as string)} className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-md">Delete</button>}
                                            <button onClick={handleSaveLecture} className="px-3 py-1.5 text-sm bg-gray-900 text-white hover:bg-black rounded-md font-medium">Save</button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={editingLecture.title} onChange={e => setEditingLecture({ ...editingLecture, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300" />
                                        <input type="text" placeholder="Short Description" value={editingLecture.description} onChange={e => setEditingLecture({ ...editingLecture, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300" />
                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                            <input type="checkbox" checked={editingLecture.is_published} onChange={e => setEditingLecture({ ...editingLecture, is_published: e.target.checked })} className="rounded text-pink-500 focus:ring-pink-400 w-4 h-4" />
                                            Publish to User
                                        </label>
                                        <textarea
                                            placeholder="Markdown Content... e.g. # Introduction \n\n Welcome to the SQL module..."
                                            value={editingLecture.content}
                                            onChange={e => setEditingLecture({ ...editingLecture, content: e.target.value })}
                                            className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300 font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {lectures.map((lecture) => (
                                        <LectureCard key={lecture.id} lecture={lecture} isAdmin={true} onClick={openEditor} />
                                    ))}
                                    {lectures.length === 0 && <p className="col-span-3 text-gray-500 text-center py-6">No lectures found.</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Tracking List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <span>⚡</span> Time Tracking
                            </h3>

                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Page Distribution</h4>
                                <div className="space-y-3">
                                    {stats?.pageActivity.map((pa, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 truncate mr-2" title={pa.page_name}>{pa.page_name === '/dashboard' ? 'Dashboard' : pa.page_name}</span>
                                                <span className="text-gray-900 font-medium">{(pa._sum.time_spent_seconds / 60).toFixed(1)}m</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${Math.min((pa._sum.time_spent_seconds / (stats.totalTimeSeconds || 1)) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Recent Logins</h4>
                                <div className="space-y-4">
                                    {stats?.recentSessions.map((session, idx) => (
                                        <div key={idx} className="flex justify-between items-start text-sm border-b border-gray-50 pb-3 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-800">{new Date(session.login_time).toLocaleDateString()} {new Date(session.login_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{session.ip_address || 'Unknown IP'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${session.logout_time ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                                    {session.logout_time ? `${(session.session_duration_seconds / 60).toFixed(1)}m` : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

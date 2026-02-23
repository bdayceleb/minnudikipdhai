'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import LectureCard from '../../components/LectureCard';
import { LogOut, Activity, Flame, Shield, Clock, FileText, Edit3, Trash2, Plus, RefreshCw, Loader2, Sparkles, TrendingUp } from 'lucide-react';
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
    chapterActivity: any[];
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
        if (confirm('Delete this file permanently?')) {
            await api.delete(`/lectures/${id}`);
            await fetchData();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <p className="font-medium tracking-wide">Initializing Control Center...</p>
                </div>
            </div>
        );
    }

    const totalHours = stats ? (stats.totalTimeSeconds / 3600).toFixed(1) : '0';
    const todayHours = stats ? (stats.todayTimeSeconds / 3600).toFixed(1) : '0';

    return (
        <ProtectedRoute requireRole="ADMIN">
            <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-500/20 overflow-x-hidden relative">
                {/* Background ambient glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white/80 backdrop-blur-xl p-6 md:px-8 rounded-2xl border border-slate-200 shadow-sm gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-inner">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-800">Central Command</h1>
                                <p className="text-slate-500 text-sm font-medium tracking-wide">Admin Access &middot; {user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm"
                        >
                            <LogOut size={16} /> Disconnect
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Main Left - Analytics & Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* KPI Cards */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> Total Hours Studied</span>
                                    <span className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{totalHours}</span>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Flame size={14} className="text-amber-500" /> Today's Focus</span>
                                    <span className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{todayHours} <span className="text-lg font-bold text-slate-400">hrs</span></span>
                                </div>
                                <div className="bg-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest relative z-10 flex items-center gap-2">Sleep Logic Meter</span>
                                    <div className="flex items-end gap-2 text-4xl font-black tracking-tighter relative z-10 mt-4">
                                        {(Number(todayHours) * 2).toFixed(1)} <span className="text-lg font-bold text-emerald-400 pb-1 uppercase tracking-wider">hrs rest</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" size={20} /> Weekly Activity Trend
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.weeklyChart}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} dx={-10} />
                                            <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                                            <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Content Management */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm" id="content-mgmt">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="text-emerald-500" size={20} /> Content Management
                                    </h3>
                                    <button
                                        onClick={() => openEditor()}
                                        className="px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm group"
                                    >
                                        <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Create File
                                    </button>
                                </div>

                                {editingLecture ? (
                                    <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-xl shadow-inner relative">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-800 tracking-wide">{editingLecture.id ? 'Edit System File' : 'New System File'}</h4>
                                            <div className="flex gap-3">
                                                <button onClick={() => setEditingLecture(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors font-semibold shadow-sm">Cancel</button>
                                                {editingLecture.id && (
                                                    <button onClick={() => deleteLecture(editingLecture.id as string)} className="px-4 py-2 text-sm text-red-600 hover:text-white bg-red-50 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2 font-semibold">
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                )}
                                                <button onClick={handleSaveLecture} className="px-6 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors shadow-sm">
                                                    Save & Sync
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Document Title</label>
                                                <input type="text" value={editingLecture.title} onChange={e => setEditingLecture({ ...editingLecture, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold shadow-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Summary</label>
                                                <input type="text" value={editingLecture.description} onChange={e => setEditingLecture({ ...editingLecture, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium shadow-sm" />
                                            </div>

                                            <label className="flex items-center gap-3 cursor-pointer group w-max">
                                                <div className="relative flex items-center">
                                                    <input type="checkbox" checked={editingLecture.is_published} onChange={e => setEditingLecture({ ...editingLecture, is_published: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Deploy to User Dashboard</span>
                                            </label>

                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center justify-between">
                                                    <span>Markdown Content</span>
                                                    <span className="text-slate-400 font-medium">Fully supports MD formatting</span>
                                                </label>
                                                <textarea
                                                    value={editingLecture.content}
                                                    onChange={e => setEditingLecture({ ...editingLecture, content: e.target.value })}
                                                    className="w-full h-[400px] px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm leading-relaxed shadow-sm"
                                                    placeholder="# Header 1&#10;## Header 2&#10;**Bold text**"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {lectures.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50">
                                                <Sparkles className="text-slate-300 mb-4" size={32} />
                                                <p className="text-slate-500 font-medium text-sm">No files in database.<br />Initiate content creation above.</p>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                {lectures.map((lecture) => (
                                                    <div key={lecture.id} className="relative group">
                                                        <LectureCard lecture={lecture} isAdmin={true} onClick={() => openEditor(lecture.id)} />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEditor(lecture.id); }}
                                                            className="absolute top-4 right-4 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 shadow-sm z-20"
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Tracking List */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full sticky top-8 relative overflow-hidden">
                                <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                                    <Activity className="text-emerald-500" size={20} /> Live Telemetry
                                </h3>

                                <div className="mb-10 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Page Distribution</h4>
                                    <div className="space-y-4">
                                        {stats?.pageActivity.map((pa, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-slate-700 font-bold truncate mr-2" title={pa.page_name}>
                                                        {pa.page_name === '/dashboard' ? 'Dashboard' : pa.page_name}
                                                    </span>
                                                    <span className="text-slate-500 font-medium">
                                                        {(pa._sum.time_spent_seconds / 3600).toFixed(1)}h
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${Math.min((pa._sum.time_spent_seconds / stats.totalTimeSeconds) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {!stats?.pageActivity.length && (
                                            <p className="text-xs text-slate-400 font-medium italic">No tracking data yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-10 bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Chapter Distribution</h4>
                                    <div className="space-y-4">
                                        {stats?.chapterActivity?.map((ca: any, idx: number) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-slate-700 font-bold truncate mr-2" title={ca.chapter_title}>
                                                        {ca.chapter_title}
                                                    </span>
                                                    <span className="text-slate-500 font-medium">
                                                        {(ca._sum.time_spent_seconds / 60).toFixed(1)}m
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-teal-500 rounded-full"
                                                        style={{ width: `${Math.min((ca._sum.time_spent_seconds / stats.totalTimeSeconds) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {!stats?.chapterActivity?.length && (
                                            <p className="text-xs text-slate-400 font-medium italic">No chapter data yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Recent Sessions</h4>
                                    <div className="space-y-4">
                                        {stats?.recentSessions.map((session, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-bold text-slate-700 truncate max-w-[120px]" title={session.page_name}>
                                                        {session.page_name === '/dashboard' ? 'Dashboard' : session.page_name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                                                        {new Date(session.created_at).toLocaleDateString()} &middot; {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-600">+{Math.ceil(session.time_spent_seconds / 60)}m</p>
                                                </div>
                                            </div>
                                        ))}
                                        {!stats?.recentSessions.length && (
                                            <p className="text-xs text-slate-400 font-medium italic">No recent sessions.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

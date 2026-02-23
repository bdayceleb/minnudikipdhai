'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { motion } from 'framer-motion';
import { LogOut, Target, BookOpen, ArrowLeft, Loader2, Sparkles, TrendingUp, Zap, GraduationCap, Clock, LayoutDashboard, FileText, Award, ChevronRight, BarChart3, Play, Settings, Eye, EyeOff, CheckCircle2, AlertCircle, Lock, User } from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
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

type SidebarTab = 'dashboard' | 'courses' | 'progress' | 'achievements' | 'settings';

function DashboardContent() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlTab = searchParams.get('tab') as SidebarTab | null;
    const initialTab = (urlTab && ['dashboard', 'courses', 'progress', 'achievements', 'settings'].includes(urlTab))
        ? urlTab
        : 'dashboard';

    const [stats, setStats] = useState<StatData | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTabState] = useState<SidebarTab>(initialTab);
    const setActiveTab = (tab: SidebarTab) => {
        setActiveTabState(tab);
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const [quote, setQuote] = useState("Small steps every day lead to massive results. 🚀");

    // Password change state
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [pwdLoading, setPwdLoading] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch('https://dummyjson.com/quotes/random');
                const data = await res.json();
                if (data && data.quote) setQuote(data.quote);
            } catch (e) { /* fallback */ }
        };
        fetchQuote();
    }, []);

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

    const openLecture = (id: string) => {
        router.push(`/courses/${id}`);
    };

    const handleChangePassword = async () => {
        setPwdMsg(null);
        if (!currentPwd || !newPwd) { setPwdMsg({ type: 'error', text: 'All fields are required' }); return; }
        if (newPwd !== confirmPwd) { setPwdMsg({ type: 'error', text: 'New passwords do not match' }); return; }
        if (newPwd.length < 3) { setPwdMsg({ type: 'error', text: 'Password must be at least 3 characters' }); return; }

        setPwdLoading(true);
        try {
            await api.put('/auth/change-password', { currentPassword: currentPwd, newPassword: newPwd });
            setPwdMsg({ type: 'success', text: 'Password changed successfully! 🎉' });
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
        } catch (err: any) {
            setPwdMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
        } finally {
            setPwdLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center animate-pulse border border-emerald-100">
                        <GraduationCap size={28} />
                    </div>
                    <Loader2 className="animate-spin text-emerald-500" size={24} />
                    <p className="font-semibold tracking-wide text-sm">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    const totalHoursNum = stats ? (stats.totalTimeSeconds / 3600) : 0;
    const todayHoursNum = stats ? (stats.todayTimeSeconds / 3600) : 0;
    const totalHours = totalHoursNum.toFixed(1);
    const todayHours = todayHoursNum.toFixed(1);
    const todayPercent = Math.min((todayHoursNum / 4) * 100, 100);
    const streak = totalHoursNum > 0 ? Math.ceil(totalHoursNum / 2) : 0;

    const getProgressTheme = () => {
        if (todayHoursNum === 0) return {
            goalIcon: 'bg-rose-50 text-rose-600 border-rose-100', barColor: 'bg-gradient-to-r from-rose-500 to-red-500',
            restIcon: 'bg-rose-50 text-rose-600 border-rose-100', restText: 'text-rose-600 font-bold',
            sleepMsg: "WAKE UP AND STUDY! He can't sleep!", sleepEmoji: "🚨"
        };
        if (todayPercent < 50) return {
            goalIcon: 'bg-amber-50 text-amber-600 border-amber-100', barColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
            restIcon: 'bg-amber-50 text-amber-600 border-amber-100', restText: 'text-amber-500 font-semibold',
            sleepMsg: "Getting there... he's resting his eyes.", sleepEmoji: "🥱"
        };
        if (todayPercent < 100) return {
            goalIcon: 'bg-sky-50 text-sky-600 border-sky-100', barColor: 'bg-gradient-to-r from-sky-400 to-cyan-500',
            restIcon: 'bg-sky-50 text-sky-600 border-sky-100', restText: 'text-sky-500 font-semibold',
            sleepMsg: "Good progress! He's catching some Z's.", sleepEmoji: "💤"
        };
        return {
            goalIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100', barColor: 'bg-gradient-to-r from-emerald-400 to-teal-500',
            restIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100', restText: 'text-emerald-500 font-semibold',
            sleepMsg: "Goal met! Sleeping peacefully.", sleepEmoji: "☁️"
        };
    };

    const theme = getProgressTheme();

    const sidebarItems = [
        { id: 'dashboard' as SidebarTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses' as SidebarTab, label: 'My Courses', icon: BookOpen },
        { id: 'progress' as SidebarTab, label: 'Progress', icon: BarChart3 },
        { id: 'achievements' as SidebarTab, label: 'Achievements', icon: Award },
        { id: 'settings' as SidebarTab, label: 'Settings', icon: Settings },
    ];

    const markdownComponents = {
        h1: ({ node, ...props }: any) => <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-8 tracking-tight" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-12 mb-6 border-b border-slate-200 pb-4" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4" {...props} />,
        p: ({ node, ...props }: any) => <p className="text-slate-600 leading-relaxed mb-6 text-[15px] md:text-base font-medium" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-outside space-y-2 mb-6 text-slate-600 ml-5 marker:text-emerald-500" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-outside space-y-2 mb-6 text-slate-600 ml-5 marker:text-emerald-500 font-semibold" {...props} />,
        li: ({ node, ...props }: any) => <li className="leading-relaxed pl-1" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-bold text-slate-800" {...props} />,
        a: ({ node, ...props }: any) => <a className="text-teal-600 font-bold hover:text-teal-700 hover:underline underline-offset-4" {...props} />,
        table: ({ node, ...props }: any) => <div className="overflow-x-auto mb-10 w-full rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left border-collapse text-sm whitespace-nowrap" {...props} /></div>,
        thead: ({ node, ...props }: any) => <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]" {...props} />,
        th: ({ node, ...props }: any) => <th className="p-4 md:p-5 border-b border-slate-200" {...props} />,
        td: ({ node, ...props }: any) => <td className="p-4 md:p-5 border-b border-slate-100 text-slate-600 font-medium" {...props} />,
        pre: ({ node, ...props }: any) => (
            <div className="rounded-2xl overflow-hidden mb-8 bg-[#1e293b] shadow-xl shadow-slate-900/10 border border-slate-700">
                <div className="bg-slate-700/50 px-4 py-3 text-xs font-mono text-slate-400 border-b border-white/5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                </div>
                <pre className="p-5 md:p-6 overflow-x-auto text-[13px] text-emerald-300 font-mono leading-relaxed" {...props} />
            </div>
        ),
        code: ({ node, className, ...props }: any) => {
            const isInline = !className;
            return isInline ? (
                <code className="bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-mono text-[13px] font-bold border border-teal-100" {...props} />
            ) : (
                <code className={className} {...props} />
            );
        },
        hr: ({ node, ...props }: any) => <hr className="my-12 border-slate-200" {...props} />
    };

    return (
        <ProtectedRoute requireRole="USER">
            <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">

                {/* ─── LEFT SIDEBAR ─── */}
                <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200/80 fixed h-screen z-40">
                    {/* Logo */}
                    <div className="p-6 pb-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-slate-800 tracking-tight">Motu Ki Pdhai</h1>
                                <p className="text-[11px] text-slate-400 font-medium">Learning Platform</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Profile Card */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Student</p>
                                </div>
                            </div>
                            <button onClick={logout}
                                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-lg py-2.5 transition-all border border-slate-200 hover:border-rose-200">
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ─── MAIN CONTENT ─── */}
                <main className="flex-1 lg:ml-[260px]">

                    {/* Top Header */}
                    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30">
                        <div className="px-6 md:px-8 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="lg:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                                    <GraduationCap size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Home / <span className="text-slate-600">{sidebarItems.find(i => i.id === activeTab)?.label}</span></p>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        {sidebarItems.find(i => i.id === activeTab)?.label}
                                    </h2>
                                </div>
                            </div>
                            <button onClick={logout}
                                className="lg:hidden px-3 py-2 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white rounded-lg transition-all border border-slate-200">
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </header>

                    <div className="p-6 md:p-8">

                        {/* ═══ DASHBOARD TAB ═══ */}
                        {activeTab === 'dashboard' ? (
                            <div className="space-y-6">
                                {/* Hero Banner - warm gradient */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="max-w-xl">
                                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Hi, {user?.name}! 👋</h2>
                                            <p className="text-emerald-100 text-sm md:text-base font-medium leading-relaxed max-w-md">"{quote}"</p>
                                        </div>
                                        <div className="bg-white/15 backdrop-blur-lg px-8 py-6 rounded-2xl border border-white/20 text-center min-w-[160px]">
                                            <p className="text-5xl font-black tracking-tighter">{todayHours}</p>
                                            <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mt-2">hrs today</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Stats Row */}
                                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {/* Today's Goal */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${theme.goalIcon}`}><Target size={18} /></div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Goal</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold text-slate-800">{todayHours} hrs</span>
                                                <span className="text-slate-400 font-medium">/ 4 hrs</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${todayPercent}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
                                                    className={`h-full rounded-full ${theme.barColor}`} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Total Study */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100"><TrendingUp size={18} /></div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Study</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-800 tracking-tight">{totalHours} <span className="text-base font-semibold text-slate-400">hrs</span></p>
                                    </motion.div>

                                    {/* Streak */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100"><Zap size={18} /></div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Streak</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-800 tracking-tight">{streak} <span className="text-base font-semibold text-slate-400">days</span></p>
                                    </motion.div>

                                    {/* His Rest */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${theme.restIcon}`}><Clock size={18} /></div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">His Rest</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-800 tracking-tight">{(Number(todayHours) * 2).toFixed(1)} <span className="text-base font-semibold text-slate-400">/ 8 hrs</span></p>
                                        <p className={`text-xs mt-1.5 transition-colors ${theme.restText}`}>{theme.sleepMsg} {theme.sleepEmoji}</p>
                                    </motion.div>
                                </div>

                                {/* Chart + Quick Access */}
                                <div className="grid lg:grid-cols-5 gap-6">
                                    {/* Weekly Chart */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <BarChart3 className="text-teal-500" size={18} /> Weekly Activity
                                        </h3>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={stats?.weeklyChart}>
                                                    <defs>
                                                        <linearGradient id="colorHrs" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} dy={8} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} dx={-8} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 600 }} />
                                                    <Area type="monotone" dataKey="hours" stroke="#14B8A6" strokeWidth={2.5} fill="url(#colorHrs)" dot={{ r: 4, fill: '#fff', strokeWidth: 2.5, stroke: '#14B8A6' }} activeDot={{ r: 6, fill: '#14B8A6' }} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>

                                    {/* Quick Access */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                        className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <BookOpen className="text-emerald-500" size={18} /> My Courses
                                            </h3>
                                            <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                                                View All <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {lectures.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <Sparkles className="text-slate-300 mb-3" size={24} />
                                                    <p className="text-slate-400 text-sm font-medium">No courses yet.</p>
                                                </div>
                                            ) : (
                                                lectures.slice(0, 3).map((lecture) => (
                                                    <button key={lecture.id} onClick={() => openLecture(lecture.id)}
                                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all group text-left">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                                            <Play size={14} fill="white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 truncate transition-colors">{lecture.title}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{lecture.description}</p>
                                                        </div>
                                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            /* ═══ COURSES TAB ═══ */
                        ) : activeTab === 'courses' ? (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
                                    <p className="text-slate-500 mt-1 text-sm font-medium">Each chapter = 1 step closer to the goal.</p>
                                </div>
                                {lectures.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                                        <Sparkles className="text-emerald-300 mb-4" size={36} />
                                        <p className="text-slate-500 font-medium">No modules available yet.<br />New chapters are being prepared!</p>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {lectures.map((lecture, i) => (
                                            <motion.div key={lecture.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                onClick={() => openLecture(lecture.id)}
                                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                                                <div className="h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 relative overflow-hidden">
                                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
                                                    <div className="absolute bottom-4 left-5">
                                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                                                            <FileText size={22} />
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-4 right-4">
                                                        <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white font-bold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">Module</span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">{lecture.title}</h3>
                                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">{lecture.description}</p>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: '0%' }} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {new Date(lecture.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                            Start <ChevronRight size={14} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            /* ═══ PROGRESS TAB ═══ */
                        ) : activeTab === 'progress' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-800">Your Progress</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.goalIcon}`}><Target size={18} /></div>
                                            <span className="text-sm font-bold text-slate-700">Today's Goal</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold text-slate-800">{todayHours} hrs studied</span>
                                                <span className="text-slate-400 font-medium">Goal: 4 hrs</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${todayPercent}%` }} transition={{ duration: 1.5 }}
                                                    className={`h-full rounded-full ${theme.barColor}`} />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">{Math.round(todayPercent)}% complete</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.restIcon}`}><Clock size={18} /></div>
                                            <span className="text-sm font-bold text-slate-700">His Rest</span>
                                        </div>
                                        <p className="text-4xl font-black text-slate-800 tracking-tight">{(Number(todayHours) * 2).toFixed(1)} <span className="text-lg font-semibold text-slate-400">/ 8 hrs</span></p>
                                        <p className={`text-sm mt-2 ${theme.restText}`}>{theme.sleepMsg} {theme.sleepEmoji}</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <BarChart3 className="text-teal-500" size={18} /> Weekly Study Hours
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats?.weeklyChart}>
                                                <defs>
                                                    <linearGradient id="colorHrs2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} dy={8} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} dx={-8} />
                                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 600 }} />
                                                <Area type="monotone" dataKey="hours" stroke="#14B8A6" strokeWidth={2.5} fill="url(#colorHrs2)" dot={{ r: 4, fill: '#fff', strokeWidth: 2.5, stroke: '#14B8A6' }} activeDot={{ r: 6, fill: '#14B8A6' }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            /* ═══ ACHIEVEMENTS TAB ═══ */
                        ) : activeTab === 'achievements' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-800">Achievements</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {[
                                        { title: 'First Step', desc: 'Complete your first study session', emoji: '🎯', done: totalHoursNum > 0 },
                                        { title: 'On a Roll', desc: 'Study for 3+ days', emoji: '🔥', done: streak >= 3 },
                                        { title: 'Dedicated', desc: 'Accumulate 10+ hours', emoji: '⭐', done: totalHoursNum >= 10 },
                                        { title: 'Daily Champion', desc: 'Hit your daily 4-hr goal', emoji: '🏆', done: todayPercent >= 100 },
                                        { title: 'Scholar', desc: 'Complete 50+ hours', emoji: '📚', done: totalHoursNum >= 50 },
                                        { title: 'Master', desc: 'Complete 100+ hours', emoji: '🎓', done: totalHoursNum >= 100 },
                                    ].map((badge, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                            className={`rounded-2xl p-6 border-2 transition-all ${badge.done ? 'bg-white border-emerald-200 shadow-md shadow-emerald-500/10' : 'bg-slate-50 border-dashed border-slate-200 opacity-50'
                                                }`}>
                                            <div className="text-3xl mb-3">{badge.emoji}</div>
                                            <h4 className="font-bold text-slate-800 text-sm">{badge.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">{badge.desc}</p>
                                            {badge.done && <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-3">✓ Unlocked</p>}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            /* ═══ SETTINGS TAB ═══ */
                        ) : (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

                                {/* Profile Info */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"><User size={18} className="text-slate-400" /> Profile Information</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Name</label>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700">{user?.name}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Username</label>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700">{user?.username}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Role</label>
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 capitalize">{user?.role?.toLowerCase()}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"><Lock size={18} className="text-slate-400" /> Change Password</h3>

                                    {pwdMsg && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-center gap-2 text-sm font-semibold mb-5 p-4 rounded-xl border ${pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>
                                            {pwdMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            {pwdMsg.text}
                                        </motion.div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Current Password</label>
                                            <div className="relative">
                                                <input type={showCurrentPwd ? 'text' : 'password'} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all pr-12"
                                                    placeholder="Enter current password" />
                                                <button onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                    {showCurrentPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">New Password</label>
                                            <div className="relative">
                                                <input type={showNewPwd ? 'text' : 'password'} value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all pr-12"
                                                    placeholder="Enter new password" />
                                                <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                    {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 block">Confirm New Password</label>
                                            <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                                                placeholder="Confirm new password" />
                                        </div>
                                        <button onClick={handleChangePassword} disabled={pwdLoading}
                                            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {pwdLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                            {pwdLoading ? 'Changing...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm">
                                    <h3 className="text-base font-bold text-rose-700 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">Sign out of your account on this device.</p>
                                    <button onClick={logout}
                                        className="px-6 py-2.5 bg-white hover:bg-rose-50 text-rose-600 font-bold text-sm rounded-xl border-2 border-rose-200 hover:border-rose-300 transition-all flex items-center gap-2">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}

export default function UserDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}

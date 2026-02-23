'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import api from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, BookOpen, ChevronRight, ChevronLeft, Menu, X, LayoutDashboard, Terminal } from 'lucide-react';
import SqlPlayground from '../../../components/playground/SqlPlayground';

interface Chapter {
    id: string;
    title: string;
    content: string;
}

export default function CourseViewer() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState('');
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [activeChapterIdx, setActiveChapterIdx] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPlayground, setShowPlayground] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/lectures/${id}`);
                setCourseTitle(data.title);
                parseMarkdownToChapters(data.content);
            } catch (error) {
                console.error('Error fetching course', error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, router]);

    // Chapter Time Tracking Heartbeat
    useEffect(() => {
        if (chapters.length === 0) return;

        const intervalId = setInterval(async () => {
            try {
                const activeChapter = chapters[activeChapterIdx];
                await api.post('/tracking/chapter-heartbeat', {
                    courseId: id,
                    chapterId: activeChapter.id,
                    chapterTitle: activeChapter.title,
                    timeSpentSeconds: 10
                });
            } catch (error) {
                console.error('Failed to record chapter heartbeat', error);
            }
        }, 10000); // 10 seconds

        return () => clearInterval(intervalId);
    }, [chapters, activeChapterIdx, id]);

    const parseMarkdownToChapters = (markdown: string) => {
        // Strip out the main title if it exists at the very top (e.g. # The Ultimate SQL Masterclass)
        let processedMd = markdown;
        if (processedMd.trim().startsWith('# ')) {
            const firstNewlineIdx = processedMd.indexOf('\n');
            if (firstNewlineIdx !== -1) {
                processedMd = processedMd.substring(firstNewlineIdx + 1).trim();
            }
        }

        // Split by H2 headers (## ) to create chapters
        // This regex splits the text while keeping the delimiter
        const sections = processedMd.split(/(?=^##\s)/m);

        let parsedChapters: Chapter[] = [];

        // If the document doesn't start with an H2, group the introductory text into an "Introduction" chapter
        if (sections.length > 0 && !sections[0].trim().startsWith('## ')) {
            parsedChapters.push({
                id: 'intro',
                title: 'Introduction',
                content: sections[0]
            });
            sections.shift();
        }

        sections.forEach((section, index) => {
            if (!section.trim()) return;

            // Extract the title from the first line (the ## line)
            const lines = section.split('\n');
            const headingLine = lines[0];
            const title = headingLine.replace(/^##\s+/, '').trim();

            // The rest of the content includes the heading, so we'll just keep it all for ReactMarkdown to render the H2, 
            // OR we can strip the H2 to let the UI render it, but keeping it is safer for markdown flow.
            // Actually, we'll strip the H2 line so we can render our own custom fancy Header for the chapter!
            const contentWithoutHeading = lines.slice(1).join('\n').trim();

            parsedChapters.push({
                id: `chapter-${index}`,
                title: title || `Chapter ${index + 1}`,
                content: contentWithoutHeading
            });
        });

        if (parsedChapters.length === 0) {
            // Fallback if no H2s exist
            parsedChapters.push({
                id: 'full',
                title: 'Full Content',
                content: markdown
            });
        }

        setChapters(parsedChapters);
    };

    const handleNext = () => {
        if (activeChapterIdx < chapters.length - 1) {
            setActiveChapterIdx(activeChapterIdx + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (activeChapterIdx > 0) {
            setActiveChapterIdx(activeChapterIdx - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const markdownComponents = {
        h1: ({ node, ...props }: any) => <h1 className="text-3xl font-black text-slate-800 mb-6 tracking-tight" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-5 border-b border-slate-200 pb-3" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4" {...props} />,
        p: ({ node, ...props }: any) => <p className="text-slate-600 leading-relaxed mb-6 text-[15px] font-medium" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-outside space-y-2 mb-6 text-slate-600 ml-5 marker:text-emerald-500" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-outside space-y-2 mb-6 text-slate-600 ml-5 marker:text-emerald-500 font-semibold" {...props} />,
        li: ({ node, ...props }: any) => <li className="leading-relaxed pl-1" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-bold text-slate-800" {...props} />,
        table: ({ node, ...props }: any) => <div className="overflow-x-auto mb-8 w-full rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left border-collapse text-sm whitespace-nowrap" {...props} /></div>,
        thead: ({ node, ...props }: any) => <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]" {...props} />,
        th: ({ node, ...props }: any) => <th className="p-4 border-b border-slate-200" {...props} />,
        td: ({ node, ...props }: any) => <td className="p-4 border-b border-slate-100 text-slate-600 font-medium" {...props} />,
        pre: ({ node, ...props }: any) => (
            <div className="rounded-xl overflow-hidden mb-8 bg-[#1e293b] shadow-lg border border-slate-700">
                <div className="bg-slate-700/50 px-4 py-2 text-xs font-mono text-slate-400 border-b border-white/5 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
                </div>
                <pre className="p-5 overflow-x-auto text-[13px] text-emerald-300 font-mono leading-relaxed" {...props} />
            </div>
        ),
        code: ({ node, className, ...props }: any) => {
            const isInline = !className;
            return isInline ? (
                <code className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-md font-mono text-[13px] font-bold border border-teal-100" {...props} />
            ) : <code className={className} {...props} />;
        },
        hr: ({ node, ...props }: any) => <hr className="my-10 border-slate-200" {...props} />
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <p className="font-semibold tracking-wide text-sm">Loading course...</p>
                </div>
            </div>
        );
    }

    const activeChapter = chapters[activeChapterIdx];

    return (
        <ProtectedRoute requireRole="USER">
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans relative">

                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <h1 className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{courseTitle}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowPlayground(true)} className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <Terminal size={14} /> SQL Playground
                        </button>
                        <button onClick={() => router.push('/dashboard?tab=courses')} className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                            Exit <X size={14} />
                        </button>
                    </div>
                </header>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* ─── LEFT SIDEBAR (TOC) ─── */}
                <aside className={`
                    fixed md:sticky top-0 left-0 h-screen w-[220px] bg-white border-r border-slate-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out flex-shrink-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <button onClick={() => router.push('/dashboard?tab=courses')} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-2 group transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Courses
                        </button>
                        <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                    </div>

                    <div className="px-5 pt-5">
                        <button onClick={() => setShowPlayground(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-all text-sm group">
                            <Terminal size={16} className="group-hover:rotate-12 transition-transform" /> Open SQL Playground
                        </button>
                    </div>

                    <div className="p-6 pb-2">
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Course Contents</h2>
                        <h3 className="font-bold text-slate-800 leading-tight">{courseTitle}</h3>

                        <div className="mt-4 mb-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                                style={{ width: `${((activeChapterIdx + 1) / chapters.length) * 100}%` }} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-right">{activeChapterIdx + 1} of {chapters.length}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
                        {chapters.map((chapter, idx) => {
                            const isActive = idx === activeChapterIdx;
                            const isPast = idx < activeChapterIdx;
                            return (
                                <button
                                    key={chapter.id}
                                    onClick={() => { setActiveChapterIdx(idx); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center gap-3 ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 ring-4 ring-emerald-500/20' :
                                        isPast ? 'bg-emerald-400 opacity-50' :
                                            'bg-slate-300'
                                        }`}
                                    />
                                    <span className={`text-sm tracking-tight ${isActive || isPast ? 'font-bold' : 'font-medium'} line-clamp-2`}>
                                        {chapter.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* ─── MAIN CONTENT AREA ─── */}
                <main className="flex-1 min-w-0 bg-[#F8FAFC]">
                    <div className="w-full xl:max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
                        <motion.div
                            key={activeChapter.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 lg:p-16"
                        >
                            {/* Chapter Header */}
                            <div className="mb-10 pb-8 border-b border-slate-100">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                                    {activeChapter.title}
                                </h1>
                            </div>

                            {/* Markdown Render */}
                            <div className="prose prose-slate max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                    {activeChapter.content}
                                </ReactMarkdown>
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={activeChapterIdx === 0}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                                >
                                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Previous Chapter
                                </button>

                                {activeChapterIdx < chapters.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Next Chapter <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push('/dashboard?tab=courses')}
                                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold hover:shadow-lg hover:shadow-slate-900/25 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Finish Course <BookOpen size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </main>

                {showPlayground && <SqlPlayground onClose={() => setShowPlayground(false)} />}
            </div>
        </ProtectedRoute>
    );
}

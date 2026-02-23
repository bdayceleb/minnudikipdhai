import { FileText, Lock, ChevronRight } from 'lucide-react';

interface Lecture {
    id: string;
    title: string;
    description: string;
    is_published: boolean;
    created_at: string;
}

interface LectureCardProps {
    lecture: Lecture;
    onClick: () => void;
    isAdmin?: boolean;
}

export default function LectureCard({ lecture, onClick, isAdmin }: LectureCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden
                ${isAdmin && !lecture.is_published
                    ? 'bg-amber-50 border-2 border-dashed border-amber-200 hover:border-amber-400 hover:bg-amber-100/50'
                    : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1'
                }
            `}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 border ${isAdmin && !lecture.is_published
                        ? 'bg-amber-50 border-amber-200 text-amber-500'
                        : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    }`}>
                    {isAdmin && !lecture.is_published ? (
                        <Lock size={18} />
                    ) : (
                        <FileText size={18} />
                    )}
                </div>
                {isAdmin && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${lecture.is_published
                            ? 'bg-teal-50 text-teal-600 border border-teal-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                        {lecture.is_published ? 'Live' : 'Draft'}
                    </span>
                )}
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                {lecture.title}
            </h3>

            <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {lecture.description}
            </p>

            <div className="mt-5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(lecture.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}

import { FileText, Lock } from 'lucide-react';

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
                bg-white/5 border backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 group
                ${isAdmin && !lecture.is_published
                    ? 'border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/5'
                    : 'border-white/10 hover:border-rose-500/50 hover:bg-white/[0.07]'
                }
            `}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {isAdmin && !lecture.is_published ? (
                        <Lock size={20} className="text-yellow-400" />
                    ) : (
                        <FileText size={20} className={isAdmin ? "" : "text-rose-400"} />
                    )}
                </div>
                {isAdmin && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${lecture.is_published ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'}`}>
                        {lecture.is_published ? 'Published' : 'Draft'}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-rose-400 transition-colors">
                {lecture.title}
            </h3>

            <p className="text-sm text-neutral-400 font-light line-clamp-2 leading-relaxed">
                {lecture.description}
            </p>

            <div className="mt-6 text-xs text-neutral-500 font-medium tracking-wide">
                Added {new Date(lecture.created_at).toLocaleDateString()}
            </div>
        </div>
    );
}

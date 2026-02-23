import { motion } from 'framer-motion';

interface Lecture {
    id: string;
    title: string;
    description: string;
    is_published: boolean;
    created_at: string;
}

interface Props {
    lecture: Lecture;
    onClick: (id: string) => void;
    isAdmin?: boolean;
}

export default function LectureCard({ lecture, onClick, isAdmin }: Props) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl border ${!lecture.is_published ? 'bg-gray-50 border-gray-200' : 'bg-white border-pink-100 shadow-sm hover:shadow-md'} cursor-pointer transition-all relative overflow-hidden`}
            onClick={() => onClick(lecture.id)}
        >
            {isAdmin && (
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-semibold ${lecture.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {lecture.is_published ? 'Published' : 'Draft'}
                </div>
            )}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-50 text-2xl flex items-center justify-center shrink-0">
                    📚
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{lecture.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{lecture.description || 'No description provided.'}</p>
                    <div className="mt-3 text-xs text-gray-400">
                        Added on {new Date(lecture.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

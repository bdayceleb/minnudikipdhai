'use client';

import { useState, useEffect, useRef } from 'react';
import initSqlJs, { Database } from 'sql.js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Database as DbIcon, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

interface SqlPlaygroundProps {
    onClose: () => void;
}

const QUESTIONS = [
    {
        id: 1,
        title: "Basic SELECT",
        description: "Fetch all columns from the `employees` table.",
        solutionSnippet: "SELECT * FROM employees;"
    },
    {
        id: 2,
        title: "Filtering Data",
        description: "Find the names and salaries of employees who earn more than 70000.",
        solutionSnippet: "SELECT name, salary FROM employees WHERE salary > 70000;"
    },
    {
        id: 3,
        title: "INNER JOIN",
        description: "List all employees along with their department names.",
        solutionSnippet: "SELECT e.name, d.department_name \nFROM employees e \nJOIN departments d ON e.department_id = d.id;"
    },
    {
        id: 4,
        title: "Aggregation",
        description: "Find the total salary paid by each department.",
        solutionSnippet: "SELECT d.department_name, SUM(e.salary) as total_salary \nFROM employees e \nJOIN departments d ON e.department_id = d.id \nGROUP BY d.department_name;"
    }
];

interface QueryResult {
    columns: string[];
    values: any[][];
}

export default function SqlPlayground({ onClose }: SqlPlaygroundProps) {
    const [db, setDb] = useState<Database | null>(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('SELECT * FROM employees;');
    const [results, setResults] = useState<QueryResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeQuestion, setActiveQuestion] = useState(QUESTIONS[0]);

    useEffect(() => {
        const initDB = async () => {
            try {
                const SQL = await initSqlJs({
                    // Fetch the WASM binary from the highly reliable sql.js org host to bypass Next.js Turbopack MIME-type issues.
                    locateFile: file => `https://sql.js.org/dist/${file}`
                });

                const database = new SQL.Database();

                // Seed initial data
                database.run(`
                    CREATE TABLE departments (
                        id INTEGER PRIMARY KEY,
                        department_name TEXT NOT NULL
                    );
                    INSERT INTO departments VALUES (1, 'Engineering');
                    INSERT INTO departments VALUES (2, 'Sales');
                    INSERT INTO departments VALUES (3, 'HR');

                    CREATE TABLE employees (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        department_id INTEGER,
                        salary INTEGER
                    );
                    INSERT INTO employees VALUES (1, 'Alice', 1, 85000);
                    INSERT INTO employees VALUES (2, 'Bob', 1, 90000);
                    INSERT INTO employees VALUES (3, 'Charlie', 2, 65000);
                    INSERT INTO employees VALUES (4, 'David', 2, 72000);
                    INSERT INTO employees VALUES (5, 'Eve', 3, 60000);
                `);

                setDb(database);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load SQL.js", err);
                setError("Failed to initialize database engine.");
                setLoading(false);
            }
        };

        initDB();

        // Cleanup DB on unmount
        return () => {
            if (db) db.close();
        };
    }, []);

    const executeQuery = () => {
        if (!db) return;

        setError(null);
        setResults([]);

        try {
            const res = db.exec(query);
            setResults(res);

            if (res.length === 0) {
                setError("Query executed successfully but returned no results.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while executing the query.");
        }
    };

    const handleQuestionSelect = (q: typeof QUESTIONS[0]) => {
        setActiveQuestion(q);
        setQuery(q.solutionSnippet); // Pre-fill with a hint/solution snippet or keep it empty. User can learn this way.
        setResults([]);
        setError(null);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Terminal size={18} />
                            </div>
                            <div>
                                <h2 className="font-black tracking-tight">Interactive SQL Playground</h2>
                                <p className="text-xs text-slate-400 font-medium">Powered by SQLite WebAssembly</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </header>

                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                        {/* Left Panel: Questions & Schema */}
                        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
                            <div className="p-5 border-b border-slate-200">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <DbIcon size={14} /> Database Schema
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                        <p className="text-xs font-bold text-slate-800 mb-2">employees</p>
                                        <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                                            <li><span className="text-emerald-600">id</span> INTEGER PK</li>
                                            <li><span className="text-emerald-600">name</span> TEXT</li>
                                            <li><span className="text-emerald-600">department_id</span> INTEGER</li>
                                            <li><span className="text-emerald-600">salary</span> INTEGER</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                        <p className="text-xs font-bold text-slate-800 mb-2">departments</p>
                                        <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                                            <li><span className="text-emerald-600">id</span> INTEGER PK</li>
                                            <li><span className="text-emerald-600">department_name</span> TEXT</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Practice Tasks</h3>
                                <div className="space-y-2">
                                    {QUESTIONS.map(q => (
                                        <button
                                            key={q.id}
                                            onClick={() => handleQuestionSelect(q)}
                                            className={`text-left w-full p-3 rounded-xl border text-sm transition-all ${activeQuestion.id === q.id
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <p className="font-bold mb-1">{q.title}</p>
                                            <p className="text-[11px] leading-relaxed opacity-80 line-clamp-2">{q.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Editor & Results */}
                        <div className="flex-1 flex flex-col min-w-0 bg-white">

                            {/* Task Description Banner */}
                            <div className="p-4 bg-emerald-600 text-white flex gap-3">
                                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-bold">{activeQuestion.title}</p>
                                    <p className="text-xs text-emerald-100 mt-1 leading-relaxed">{activeQuestion.description}</p>
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="relative border-b border-slate-200 flex-shrink-0">
                                <div className="absolute top-3 right-3 z-10">
                                    <button
                                        onClick={executeQuery}
                                        disabled={loading || !query.trim()}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Play size={14} fill="currentColor" />
                                        {loading ? 'Booting Engine...' : 'Run Query'}
                                    </button>
                                </div>
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    spellCheck={false}
                                    className="w-full h-48 md:h-64 p-6 bg-slate-50 font-mono text-sm text-slate-800 focus:outline-none focus:bg-white transition-colors resize-none placeholder-slate-300 leading-relaxed"
                                    placeholder="SELECT * FROM employees;"
                                />
                            </div>

                            {/* Results Area */}
                            <div className="flex-1 p-6 overflow-y-auto bg-slate-100/50">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    Results
                                </h3>

                                {error ? (
                                    <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex gap-3 border border-rose-100 text-sm font-medium">
                                        <AlertCircle className="flex-shrink-0" size={18} />
                                        <p>{error}</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-widest text-[10px]">
                                                    <tr>
                                                        {results[0].columns.map((col: string, i: number) => (
                                                            <th key={i} className="px-4 py-3">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {results[0].values.map((row: any[], i: number) => (
                                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                            {row.map((val: any, j: number) => (
                                                                <td key={j} className="px-4 py-3 text-slate-700 font-mono text-[13px]">{val !== null ? String(val) : 'NULL'}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                                        <DbIcon size={32} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium">Run a query to see results here.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

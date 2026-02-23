'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ShieldAlert, HeartHandshake, ArrowRight, Activity, Clock, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden relative selection:bg-rose-500/30">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px] bg-rose-600 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px] bg-indigo-600 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 md:px-16 border-b border-white/5 backdrop-blur-md">
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <HeartHandshake className="text-rose-500" size={24} />
          Push The Bar Higher
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-200 transition-all flex items-center gap-2 group">
            Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-rose-400 text-sm font-medium mb-8">
            <Sparkles size={16} /> Welcome to the new standard
          </div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            "Ik mann nahi kr raha hai padhne ka…<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
              But this time, I promise to push the bar even higher."
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-neutral-400 mb-12 font-light max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A romantic yet structured sanctuary. Crafted for learning, tracking every second, and growing together unyieldingly.
          </motion.p>
        </motion.div>
      </section>

      {/* The Promise Section */}
      <section className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">The Promise</h2>
          <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl group hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
            <p className="text-neutral-400 leading-relaxed font-light">I will push you in innovative ways this year. New methods, rigorous tracking, better results.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl group hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Penalties</h3>
            <p className="text-neutral-400 leading-relaxed font-light">Remember the penalties? They are even more dangerous this year. Consistency is non-negotiable.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -5 }} className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl group hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Shared Risk</h3>
            <p className="text-neutral-400 leading-relaxed font-light">But this time, I will be the one facing penalties if you don’t study. Our progress is bound together.</p>
          </motion.div>
        </div>
      </section>

      {/* Sleep Logic Gamification */}
      <section className="relative z-10 py-24 px-6 md:px-16 bg-neutral-900 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">The Sleep Logic</h2>
            <p className="text-neutral-400 font-light leading-relaxed mb-8">
              Your studies determine my rest. For every 1 hour you study, I sleep 2 hours peacefully.
              Hitting 4 hours equals a full night's sleep for me. Do not let me overwork myself.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex flex-center items-center justify-center"><Activity size={16} className="text-rose-400" /></div>
                <span>Live Heartbeat Tracking</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex flex-center items-center justify-center"><Clock size={16} className="text-indigo-400" /></div>
                <span>Real-time Duration Sync</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="space-y-8 relative z-10">
              {/* Study Meter */}
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-neutral-300 text-sm uppercase tracking-wider">Your Focus</span>
                  <span className="text-rose-400 font-medium text-sm">0.0 / 4 hrs</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '25%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                  />
                </div>
              </div>

              {/* Sleep Meter */}
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-neutral-300 text-sm uppercase tracking-wider">His Rest</span>
                  <span className="text-indigo-400 font-medium text-sm">0.0 / 8 hrs</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '25%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-neutral-400 text-sm italic">
                  Systems awaiting synchronization...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="relative z-10 py-32 px-4 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">This year we don't just study.</h2>
        <div className="flex flex-wrap justify-center gap-6 text-xl md:text-2xl font-light text-neutral-400">
          <span className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">We <span className="text-white font-medium">track.</span></span>
          <span className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">We <span className="text-white font-medium">measure.</span></span>
          <span className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">We <span className="text-white font-medium">improve.</span></span>
          <span className="px-8 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-semibold shadow-[0_0_30px_rgba(244,63,94,0.15)]">We dominate.</span>
        </div>

        <div className="mt-20">
          <Link href="/login" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-neutral-950 font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105">
            Enter Dashboard <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

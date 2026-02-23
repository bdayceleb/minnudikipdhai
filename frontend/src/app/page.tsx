'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Heart, HeartHandshake, ArrowRight, Activity, Clock, Shield, Star, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      title: 'Our Little Secret',
      desc: 'No more boring trackers. This year, we learn together in a world made just for us. New methods, endless support, and rigorous tracking disguised as care.',
      icon: <Star size={24} />,
      color: 'rose',
      bgImg: 'url("https://images.unsplash.com/photo-1518621736915-f480fe372d80?q=80&w=600&auto=format&fit=crop")',
    },
    {
      id: 2,
      title: 'The Rules of Love',
      desc: 'Remember our promises? The stakes are higher this year. Consistency isn\'t just expected, it is how we show up for each other every single day.',
      icon: <Lock size={24} />,
      color: 'indigo',
      bgImg: 'url("https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop")',
    },
    {
      id: 3,
      title: 'Bound Together',
      desc: 'If you don\'t study, I face the consequences. Our progress, our risks, and our rewards are completely tied together now. We rise as one.',
      icon: <Shield size={24} />,
      color: 'emerald',
      bgImg: 'url("https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=600&auto=format&fit=crop")',
    }
  ];

  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 overflow-hidden relative selection:bg-rose-500/30 flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px] bg-rose-600 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] bg-indigo-600 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] bg-fuchsia-600 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 md:px-16 border-b border-white/5 backdrop-blur-md">
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <HeartHandshake className="text-rose-500" size={24} />
          Minu Ki Pdhai
        </div>
        <div className="flex gap-4 items-center">
          <Link href={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin' : '/dashboard') : "/login"} className="px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 border border-white/10 transition-all flex items-center gap-2 group backdrop-blur-md">
            {isAuthenticated ? 'Go to Dashboard' : 'Enter Our World'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-8">
              <Heart size={14} className="fill-rose-300" /> A Sanctuary Just For Us
            </div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              "I know it gets hard sometimes, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400">
                but this time, I'm holding your hand a bit more harder and closer."
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-neutral-400 mb-12 font-light max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Welcome to Minu Ki Pdhai. A romantic, structured world crafted specifically for your growth. Every second you spend learning here is a moment we share.
            </motion.p>
          </motion.div>
        </section>

        {/* The Promise Section - Rewritten to be Interactive */}
        <section className="relative z-10 py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Our Promises</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full mx-auto"></div>
            <p className="mt-6 text-neutral-400 font-light max-w-2xl mx-auto">
              This isn't just about finishing lectures. It's about how we show up for each other when things get tough.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                onHoverStart={() => setHoveredCard(card.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative h-[400px] rounded-3xl overflow-hidden group cursor-pointer"
              >
                {/* Background Image that zooms on hover */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: card.bgImg }}
                  animate={{
                    scale: hoveredCard === card.id ? 1.1 : 1,
                    filter: hoveredCard === card.id ? 'brightness(0.3) blur(2px)' : 'brightness(0.4) blur(0px)'
                  }}
                />

                {/* Overlay gradient */}
                <div className={`absolute inset - 0 bg - gradient - to - t from - neutral - 950 via - neutral - 950 / 80 to - transparent z - 10`} />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredCard === card.id ? -10 : 0 }}
                    className="transform transition-transform duration-500"
                  >
                    <div className={`w - 14 h - 14 rounded - 2xl bg - ${card.color} -500 / 20 text - ${card.color} -400 flex items - center justify - center mb - 6 backdrop - blur - md border border - ${card.color} -500 / 30`}>
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>

                    <div className="overflow-hidden">
                      <motion.p
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: hoveredCard === card.id ? 1 : 0.6 }}
                        transition={{ duration: 0.3 }}
                        className="text-neutral-300 leading-relaxed font-light text-sm md:text-base"
                      >
                        {card.desc}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sleep Logic Gamification */}
        <section className="relative z-10 py-24 px-6 md:px-16 mt-12 bg-neutral-950/50 border-y border-white/5 backdrop-blur-xl flex items-center min-h-[80vh]">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
                <Clock size={14} /> The Sacred Rule
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">My Rest Depends <br />On Your Focus.</h2>
              <p className="text-neutral-400 font-light leading-relaxed mb-8 text-lg">
                I can only rest easy when I know you are growing. For every <strong className="text-white font-medium">1 hour</strong> you study, I earn <strong className="text-white font-medium">2 hours</strong> of peaceful sleep. Complete your 4 hours, and you give me a full night's rest.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0"><Activity size={20} className="text-rose-400" /></div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Heartbeat Telemetry</h4>
                    <p className="text-xs text-neutral-500 mt-1">Every breath, every second on a page is tracked securely.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0"><Shield size={20} className="text-indigo-400" /></div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Synchronized Bond</h4>
                    <p className="text-xs text-neutral-500 mt-1">Your stats directly update my dashboard in real time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />

              <div className="space-y-10 relative z-10">
                {/* Example Study Meter (Fixed logic to show 1:2 ratio visual example) */}
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-neutral-400 text-xs uppercase tracking-widest">Minu's Focus (You)</span>
                    <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">1.0 / 4 hrs</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '25%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] relative"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>

                {/* Example Sleep Meter */}
                <div>
                  <div className="flex justify-between mb-4 mt-8">
                    <span className="font-bold text-neutral-400 text-xs uppercase tracking-widest">Deepak's Rest (Me)</span>
                    <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">2.0 / 8 hrs</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '50%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] relative"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center backdrop-blur-sm mt-6 group-hover:bg-white/[0.07] transition-colors">
                  <p className="text-neutral-300 text-sm font-light">
                    "Only 1 hour done... I'm still tossing and turning. Please study more soon."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="relative z-10 py-32 px-4 text-center max-w-4xl mx-auto">
          <Heart className="mx-auto text-rose-500 mb-8" size={32} />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">It's time to build your future, <br />my love.</h2>

          <div className="mt-12">
            <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-neutral-950 font-bold text-lg hover:bg-rose-50 hover:text-rose-600 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Open Your Dashboard <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-neutral-500 text-sm font-medium flex items-center justify-center gap-2">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> by you Dear Daddy
          </p>
        </div>
      </footer>
    </div>
  );
}

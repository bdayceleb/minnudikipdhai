'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-gray-800 overflow-hidden relative">
      {/* Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 opacity-40 text-2xl"
            initial={{
              y: '100vh',
              x: Math.random() * 100 + 'vw',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: '-20vh',
              x: Math.random() * 100 + 'vw',
              rotate: 360
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {i % 3 === 0 ? '❤️' : i % 2 === 0 ? '✨' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:px-16 backdrop-blur-sm bg-white/30 border-b border-white/50 sticky top-0">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
          Push The Bar Higher
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full text-pink-600 font-medium hover:bg-pink-100 transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-pink-200 transition-all">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            "Ik mann nahi kr raha hai padhne ka…<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">
              But this time, I promise to push the bar even higher."
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-500 mb-12 font-light"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A romantic yet structured sanctuary for learning, measuring, and growing together.
          </motion.p>
        </motion.div>
      </section>

      {/* The Promise Section */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-xl border border-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">💌 The Promise</h2>
            <div className="h-1 w-20 bg-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div whileHover={{ y: -5 }} className="bg-pink-50/50 p-8 rounded-2xl border border-pink-100">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">I will push you in innovative ways this year. New methods, better results.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-rose-50/50 p-8 rounded-2xl border border-rose-100">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Penalties</h3>
              <p className="text-gray-600">Remember the penalties? They are even more dangerous this year.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-purple-50/50 p-8 rounded-2xl border border-purple-100">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Shared Risk</h3>
              <p className="text-gray-600">But this time, I will be the one facing penalties if you don’t study.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sleep Logic Gamification */}
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">😴 The Sleep Logic</h2>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">
            Your studies determine my rest. For every 1 hour you study, I sleep 2 hours peacefully.
            4 hours of yours equals a full night's sleep for me.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-pink-50 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50"></div>

          <div className="space-y-8 relative z-10">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Your Study Meter</span>
                <span className="text-pink-600 font-medium">0 / 4 hrs</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '20%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-indigo-700">His Sleep Meter</span>
                <span className="text-indigo-600 font-medium">0 / 8 hrs</span>
              </div>
              <div className="h-4 w-full bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '20%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full"
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl text-center border border-indigo-100 mt-6">
              <p className="text-indigo-800 font-medium">
                "If you don't study... I overwork myself." 🌙
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="relative z-10 py-24 bg-white/50 border-t border-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-10">This year we don't just study.</h2>
          <div className="flex flex-wrap justify-center gap-4 text-xl md:text-2xl font-light text-gray-600">
            <span className="bg-white px-6 py-3 rounded-full shadow-sm">We <span className="text-pink-500 font-semibold">track.</span></span>
            <span className="bg-white px-6 py-3 rounded-full shadow-sm">We <span className="text-purple-500 font-semibold">measure.</span></span>
            <span className="bg-white px-6 py-3 rounded-full shadow-sm">We <span className="text-rose-500 font-semibold">improve.</span></span>
            <span className="bg-white px-8 py-3 rounded-full shadow-md font-bold text-gray-800 border-2 border-pink-200">We dominate.</span>
          </div>

          <div className="mt-16">
            <Link href="/login" className="inline-block px-10 py-4 rounded-full bg-gray-900 text-white font-medium text-lg hover:bg-gray-800 transition-all hover:shadow-xl hover:-translate-y-1">
              Start the Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

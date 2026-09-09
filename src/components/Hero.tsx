import React from 'react';
import { ACADEMY_DATA } from '../data';
import { Sparkles, ChevronRight, Monitor, Users, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              EST. {ACADEMY_DATA.founded} • GOVERNMENT REGISTERED
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6"
            >
              <span className="block sm:inline">Master Tech &</span>{' '}
              <span className="text-blue-600">Academics</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
            >
              Ranchi's hub for certified IT training and premium academic coaching. Hands-on practical learning with industry experts.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href="#seat-desk"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-indigo-600/20"
              >
                Reserve Seat Online
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#courses"
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-semibold transition-all shadow-sm flex items-center justify-center sm:justify-start"
              >
                Explore Courses
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-slate-200 flex items-center gap-4"
            >
               <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs uppercase">ISO</div>
               </div>
               <div>
                 <p className="text-sm font-semibold text-slate-900">ISO 9001:2015 Certified Center</p>
                 <p className="text-xs text-slate-500">Ensuring standardized IT syllabi and national validity of student certifications.</p>
               </div>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <div className="relative w-full max-w-lg">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-slate-200/50">
                 <img 
                   src={ACADEMY_DATA.heroBg}
                   alt="Students in Lab" 
                   className="absolute inset-0 w-full h-full object-cover"
                   fetchPriority="high"
                   loading="eager"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6 text-white">
                   <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">REAL ACADEMY PHOTOS</p>
                   <p className="font-medium text-lg">Active IT Labs & Academic Coaching batches</p>
                 </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">1 Student : 1 PC</p>
                  <p className="text-xs text-slate-500">Practical Excellence Guarantee</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Free Wi-Fi Campus</p>
                  <p className="text-xs text-slate-500">High-speed internet</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

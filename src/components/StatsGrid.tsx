import React from 'react';
import { STATS } from '../data';
import { Award, Users, Monitor, ShieldCheck, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap = {
  Award: Award,
  Users: Users,
  Monitor: Monitor,
  ShieldCheck: ShieldCheck,
  Wifi: Wifi
};

export default function StatsGrid() {
  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="font-semibold text-slate-800 text-sm mb-1">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

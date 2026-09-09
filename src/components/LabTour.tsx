import React, { useState } from 'react';
import { GALLERY } from '../data';
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';

export default function LabTour() {
  const [activeFilter, setActiveFilter] = useState('All Photos');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const categories = ['All Photos', ...new Set(GALLERY.map(item => item.category))];

  const filteredGallery = activeFilter === 'All Photos' 
    ? GALLERY 
    : GALLERY.filter(item => item.category === activeFilter);

  const handleImageLoad = (id: number | string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="lab-tour" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
              <Camera className="w-4 h-4" />
              Campus Tour
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              State-of-the-Art Facilities & Campus Gallery
            </h2>
            <p className="text-lg text-slate-600">
              Browse real-time snapshots of our computer labs, academic classrooms, study environments, and student achievement celebrations in Ranchi.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm overflow-x-auto max-w-full hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <motion.div
              key={`${item.id}-${activeFilter}`} // Forces re-animation on filter change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 shadow-sm border border-slate-200/50"
            >
              <div className={`absolute inset-0 bg-slate-200 animate-pulse ${loadedImages[item.id] ? 'hidden' : 'block'}`}></div>
              <img
                src={item.url}
                alt={item.category}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => handleImageLoad(item.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, Laptop, PhoneCall } from 'lucide-react';
import { ACADEMY_DATA } from '../data';

export default function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Add a slight delay before showing the popup for better UX when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-20 backdrop-blur-md"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Area */}
            <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
              
              {/* Badge */}
              <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Admissions Now Open
              </div>
              
              <h2 className="text-3xl font-display font-bold text-white mb-2 relative z-10">New Academic Year</h2>
              <p className="text-indigo-100 font-medium relative z-10">Enroll now for the upcoming session!</p>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Academic Courses */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-indigo-600">
                    <GraduationCap className="w-5 h-5" />
                    <h3 className="font-bold text-slate-900">Academic Courses</h3>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Classes I to XII</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> 11th & 12th Sci/Com</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Smart Classes</li>
                  </ul>
                </div>
                
                {/* Computer Courses */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-indigo-600">
                    <Laptop className="w-5 h-5" />
                    <h3 className="font-bold text-slate-900">Computer Courses</h3>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> DCA / DTP</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Tally + GST</li>
                    <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Typing & Design</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl text-center transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Admission Right Now
                </button>
                <a 
                  href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold py-3.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  Contact Right Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

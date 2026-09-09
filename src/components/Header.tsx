import React, { useState, useEffect } from 'react';
import { ACADEMY_DATA } from '../data';
import { Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Courses', href: '#courses' },
    { name: 'Seat Desk', href: '#seat-desk' },
    { name: 'Lab Tour', href: '#lab-tour' },
    { name: 'Mentors', href: '#mentors' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Find Us', href: '#find-us' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-0' 
          : 'bg-transparent border-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img 
            src={ACADEMY_DATA.logo} 
            alt="Academy Logo" 
            className="h-10 w-10 object-cover rounded-full" 
            fetchPriority="high"
            loading="eager"
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-indigo-900 leading-tight tracking-tight uppercase">
              {ACADEMY_DATA.name}
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
              Ranchi's Premier IT Center
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-indigo-600" />
            {ACADEMY_DATA.phone}
          </a>
          <a
            href="#seat-desk"
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Reserve Seat
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-base font-medium text-slate-700 hover:text-indigo-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  <Phone className="w-4 h-4 text-indigo-600" />
                  {ACADEMY_DATA.phone}
                </a>
                <a
                  href="#seat-desk"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
                >
                  Reserve Seat
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

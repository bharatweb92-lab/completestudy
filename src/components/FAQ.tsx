import React, { useState } from 'react';
import { FAQS, ACADEMY_DATA } from '../data';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6 border border-slate-700">
              <HelpCircle className="w-4 h-4" />
              Have Questions?
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Frequently Asked Academic Questions
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Need clarity on certificates, computer timings, or payment safety? Browse our quick answers, or contact us directly on WhatsApp for custom inquiries.
            </p>
            
            <a
              href={`https://wa.me/${ACADEMY_DATA.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-teal-400 hover:text-teal-300 transition-colors group"
            >
              Ask Sir directly on WhatsApp
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  openIndex === idx ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-white pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-0 text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

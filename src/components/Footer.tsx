import React from 'react';
import { ACADEMY_DATA, COURSES } from '../data';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="find-us" className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1.5 rounded-lg">
                <img src={ACADEMY_DATA.logo} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white tracking-wide">{ACADEMY_DATA.name}</h4>
                <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase">EST. {ACADEMY_DATA.founded} • JAMSHEDPUR</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              {ACADEMY_DATA.name} is Ranchi's leading computer literacy training center. We offer ISO 9001:2015 certified programs in office tools, Tally bookkeeping, typing speed, and full stack software coding.
            </p>
            
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Opening Hours
              </h5>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Monday - Saturday</span>
                  <span className="font-mono text-slate-300">08:00 AM - 08:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-3 border-t border-slate-800">
                  <span>Sunday</span>
                  <span className="font-mono text-slate-500 text-xs uppercase tracking-wider">Holiday / Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Col */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Quick Navigation</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#courses" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Course Catalog & Pricing</a></li>
              <li><a href="#seat-desk" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Seat Booking Desk</a></li>
              <li><a href="#lab-tour" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Computer Lab Tour</a></li>
              <li><a href="#mentors" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Faculty Mentors</a></li>
              <li><a href="#reviews" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Student Reviews</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span> Back to Header Top</a></li>
            </ul>
          </div>

          {/* Contact & Map Col */}
          <div className="lg:col-span-4">
            <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Find Our Ranchi Branch</h5>
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 mb-6 bg-slate-900 relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              {/* Using a static placeholder map image or iframe */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14713.682662055629!2d86.136152!3d22.787498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e4bd33b97dc3%3A0x6b77c6883eb977db!2sGamharia%2C%20Jamshedpur%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>{ACADEMY_DATA.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                <a href={`tel:${ACADEMY_DATA.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{ACADEMY_DATA.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                <a href={`mailto:${ACADEMY_DATA.email}`} className="hover:text-white transition-colors">{ACADEMY_DATA.email}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>© {new Date().getFullYear()} {ACADEMY_DATA.name} (Ranchi). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Estd. {ACADEMY_DATA.founded}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>ISO 9001:2015 Center</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

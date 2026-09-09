import React, { useState } from 'react';
import { MENTORS, REVIEWS } from '../data';
import { GraduationCap, Star, Quote, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function MentorsAndReviews() {
  const [likes, setLikes] = useState(124);
  const [hasLiked, setHasLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <section id="mentors" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-100">
            <GraduationCap className="w-4 h-4" />
            Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Meet Our Founder & Director
          </h2>
          <p className="text-lg text-slate-600">
            Learn from qualified professionals who possess extensive academic expertise and commercial IT skills. We maintain a friendly, supportive environment to ensure student success.
          </p>
        </div>

        {/* Mentors Section */}
        <div className="max-w-4xl mx-auto mb-24">
          {MENTORS.map((mentor, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-900 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 border-4 border-slate-800 shadow-xl relative z-10 bg-slate-800">
                <div className={`absolute inset-0 bg-slate-700 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}></div>
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              
              <div className="text-center md:text-left relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 tracking-wider mb-4">
                  {mentor.tag}
                </div>
                
                <h3 className="text-2xl font-display font-bold text-white mb-1">{mentor.name}</h3>
                <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-4">{mentor.role}</p>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-3 -left-2 w-8 h-8 text-slate-700 rotate-180 opacity-50" />
                  <p className="text-slate-300 italic text-lg leading-relaxed relative z-10 pl-6">
                    "{mentor.review}"
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      hasLiked 
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    <span className="font-semibold">{likes}</span>
                  </button>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Appreciate Message</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div id="reviews" className="text-center max-w-3xl mx-auto mb-16 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
            <Star className="w-4 h-4 fill-blue-700" />
            Student Success
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Testimonials from Our Certified Alumni
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 italic text-lg leading-relaxed mb-8">
                  "{review.text}"
                </p>
              </div>
              
              <div className="pt-6 border-t border-slate-200">
                <p className="font-bold text-slate-900">{review.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-semibold text-indigo-600">{review.course}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                    {review.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

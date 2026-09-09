import React, { useState } from 'react';
import { ACADEMY_DATA, COURSES } from '../data';
import { Send, CheckCircle2, User, Phone, Book } from 'lucide-react';

export default function SeatReservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: COURSES[0].id
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length >= 10) {
      setSubmitted(true);
      
      const selectedCourseObj = COURSES.find(c => c.id === formData.course) || COURSES[0];
      const message = `Hello Complete Study,\n\nI want to reserve a seat for a course.\n\nName: ${formData.name}\nWhatsApp Number: ${formData.phone}\nCourse: ${selectedCourseObj.name} (${selectedCourseObj.duration})\n\nPlease let me know the available batch timings.`;
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappNumber = ACADEMY_DATA.whatsapp.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.location.href = whatsappUrl;

      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section id="seat-desk" className="py-24 bg-indigo-600 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="grid lg:grid-cols-5 h-full">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-2 bg-slate-900 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">Secure Your Batch Seat</h3>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Batches fill up quickly. Reserve your dedicated PC online by submitting this form. Our counselors will call you to confirm your timing.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>No advance payment needed to book</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Guaranteed 1:1 Computer Ratio</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span>Flexible batch timings (7AM - 7PM)</span>
                  </li>
                </ul>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-slate-700">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Need Help?</p>
                <p className="text-xl font-bold">{ACADEMY_DATA.phone}</p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-white">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-slate-900">Seat Reserved!</h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Thank you {formData.name}. We have received your request. Our counselor will call you shortly to confirm your batch timing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col justify-center">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Student Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                        placeholder="e.g. Rahul Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        required
                        minLength={10}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Book className="w-5 h-5 text-slate-400" />
                      </div>
                      <select
                        id="course"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium text-slate-900 appearance-none"
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                      >
                        {COURSES.map(course => (
                          <option key={course.id} value={course.id}>{course.name} - {course.duration}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <div className="w-4 h-4 border-r-2 border-b-2 border-slate-400 rotate-45 transform -translate-y-1"></div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Confirm Booking
                    <Send className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-center text-slate-500 font-medium">
                    By submitting, you agree to our terms and conditions.
                  </p>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

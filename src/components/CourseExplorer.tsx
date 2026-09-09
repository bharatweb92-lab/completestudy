import React, { useState, useMemo } from 'react';
import { COURSES } from '../data';
import { BookOpen, CheckCircle2, IndianRupee, Clock, Briefcase, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CourseExplorer() {
  const categories = ['Computer Training', 'Academic Coaching'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  const filteredCourses = useMemo(() => COURSES.filter(c => c.category === activeCategory), [activeCategory]);
  const [selectedCourseId, setSelectedCourseId] = useState(filteredCourses[0]?.id || COURSES[0].id);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const newFiltered = COURSES.filter(c => c.category === cat);
    if (newFiltered.length > 0) {
      setSelectedCourseId(newFiltered[0].id);
    }
  };

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4" />
            Our Programs
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Explore Professional IT & Academic Coaching
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Click on any program to see syllabus modules, skills gained, and opportunities. Select a category below to browse.
          </p>

          <div className="flex justify-center items-center gap-2 bg-slate-50 p-1.5 rounded-2xl sm:rounded-full border border-slate-200 shadow-sm w-full sm:w-auto inline-flex flex-col sm:flex-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Course List Navigation */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Select a Course</h3>
            {filteredCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  selectedCourseId === course.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{course.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      selectedCourseId === course.id ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-500 bg-slate-100'
                    }`}>
                      {course.duration}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className={`text-sm ${selectedCourseId === course.id ? 'text-slate-400' : 'text-slate-500'}`}>
                    {course.fullName}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Course Details Panel */}
          <div className="w-full lg:w-2/3 bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-10 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCourse.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border border-indigo-200">
                        {selectedCourse.fullName}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-semibold">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {selectedCourse.duration}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                      Syllabus for {selectedCourse.name}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-10">
                  {/* Syllabus List */}
                  <div>
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-5">
                      <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">M</div>
                      Syllabus Modules (Practical Focus)
                    </h4>
                    <ul className="space-y-4">
                      {selectedCourse.syllabus.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Competencies */}
                  <div>
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-5">
                      <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      Key Competencies Gained
                    </h4>
                    <ul className="space-y-4 mb-8">
                      {selectedCourse.competencies.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2"></div>
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      Career Placement Pathways
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.careers.map((career, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Authorized Certification</p>
                      <p className="text-xs text-slate-500">ISO 9001:2015 Certified Diploma</p>
                    </div>
                  </div>
                  
                  <a
                    href="#seat-desk"
                    onClick={(e) => {
                      // Optionally, could set the selected course in a global state for the form
                    }}
                    className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-sm"
                  >
                    Select {selectedCourse.name} & Reserve Seat
                  </a>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

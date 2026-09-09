/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsGrid from './components/StatsGrid';
import CourseExplorer from './components/CourseExplorer';
import LabTour from './components/LabTour';
import MentorsAndReviews from './components/MentorsAndReviews';
import FAQ from './components/FAQ';
import SeatReservation from './components/SeatReservation';
import Footer from './components/Footer';
import AdmissionPopup from './components/AdmissionPopup';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        <StatsGrid />
        <CourseExplorer />
        <LabTour />
        <SeatReservation />
        <MentorsAndReviews />
        <FAQ />
      </main>
      <Footer />
      <AdmissionPopup />
    </div>
  );
}


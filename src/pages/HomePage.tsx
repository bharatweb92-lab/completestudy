/**
 * Public Complete Study website (previously composed directly in App.tsx).
 */
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StatsGrid from '../components/StatsGrid';
import CourseExplorer from '../components/CourseExplorer';
import LabTour from '../components/LabTour';
import SeatReservation from '../components/SeatReservation';
import MentorsAndReviews from '../components/MentorsAndReviews';
import FAQ from '../components/FAQ';
import VerifyCertificate from '../components/VerifyCertificate';
import Footer from '../components/Footer';
import AdmissionPopup from '../components/AdmissionPopup';

export default function HomePage() {
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
        <VerifyCertificate />
      </main>
      <Footer />
      <AdmissionPopup />
    </div>
  );
}

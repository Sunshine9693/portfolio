import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';
import { About } from './components/about/About';
import { Skills } from './components/skills/Skills';
import { Projects } from './components/projects/Projects';
import { Experience } from './components/experience/Experience';
import { Education } from './components/education/Education';
import { Gallery } from './components/gallery/Gallery';
import { Contact } from './components/contact/Contact';
import { AIAssistant } from './components/assistant/AIAssistant';
import { Footer } from './components/common/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Public Portfolio View
const PublicPortfolio = () => {
  const { data: portfolioData, isLoading } = usePortfolio();
  const [isNarratingGlobal, setIsNarratingGlobal] = useState(false);

  // Jump to narration trigger
  const handleTriggerNarration = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading && !portfolioData) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan via-indigo to-violet flex items-center justify-center font-heading text-2xl text-midnight font-bold animate-pulse shadow-glow-cyan mb-4">
          SF
        </div>
        <div className="font-mono-tech text-xs text-slate-muted uppercase tracking-widest">
          Loading Sana Fatma's Developer Portfolio...
        </div>
      </div>
    );
  }

  const heroData = portfolioData?.hero;
  const aboutData = portfolioData?.about;
  const skillsData = portfolioData?.skills;
  const projectsData = portfolioData?.projects;
  const internshipsData = portfolioData?.internships;
  const educationData = portfolioData?.education;
  const achievementsData = portfolioData?.achievements;
  const certificatesData = portfolioData?.certificates;
  const galleryData = portfolioData?.gallery;
  const socialLinksData = portfolioData?.socialLinks;

  return (
    <div className="min-h-screen bg-midnight text-slate-main relative selection:bg-cyan selection:text-midnight">
      <Navbar
        onTriggerNarration={handleTriggerNarration}
        isNarrating={isNarratingGlobal}
      />
      <main>
        <Hero heroData={heroData} />
        <About
          aboutData={aboutData}
          isNarratingGlobal={isNarratingGlobal}
          setIsNarratingGlobal={setIsNarratingGlobal}
        />
        <Skills skillsData={skillsData} />
        <Projects projectsData={projectsData} />
        <Experience internshipsData={internshipsData} />
        <Education
          educationData={educationData}
          achievementsData={achievementsData}
        />
        <Gallery
          certificatesData={certificatesData}
          galleryData={galleryData}
        />
        <Contact socialLinksData={socialLinksData} />
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PublicPortfolio />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;

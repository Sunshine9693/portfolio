import { useCallback, useState } from 'react';
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
import { usePortfolioReveal } from './hooks/usePortfolioReveal';
import { NotFound } from './components/common/NotFound';

// Public Portfolio View
const PublicPortfolio = () => {
  const { data: portfolioData, isLoading } = usePortfolio();
  usePortfolioReveal(isLoading);
  const [isNarratingGlobal, setIsNarratingGlobal] = useState(false);
  const [narrationCommand, setNarrationCommand] = useState(0);

  // The About section owns narration state. This command asks it to
  // start, pause, or resume based on its current playback state.
  const handleTriggerNarration = useCallback(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    setNarrationCommand((command) => command + 1);
  }, []);

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
        resumeUrl={heroData?.resumeUrl}
      />
      <main>
        <Hero heroData={heroData} educationData={educationData} />
        <About
          aboutData={aboutData}
          narrationCommand={narrationCommand}
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
        <Contact socialLinksData={socialLinksData} resumeUrl={heroData?.resumeUrl} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;

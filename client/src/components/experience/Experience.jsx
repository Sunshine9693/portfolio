import { useState } from 'react';
import { Calendar, MapPin, CheckCircle2, Briefcase, FileText } from 'lucide-react';
import { CertificateViewer } from '../gallery/CertificateViewer';

export const Experience = ({ internshipsData }) => {
  const [certificatePreview, setCertificatePreview] = useState(null);
  const defaultInternships = [
    {
      id: 'acmegrade',
      company: 'Acmegrade',
      role: 'Web Development Intern',
      period: 'Jul 2024 - Aug 2024',
      startDate: 'July 2024',
      endDate: 'August 2024',
      location: 'Remote',
      highlights: [
        'Built responsive web pages with HTML5 and CSS3, ensuring consistent rendering across desktop and mobile breakpoints.',
        'Partnered with senior developers to build and refine reusable UI components for client-facing projects.',
        'Applied web accessibility guidelines (WCAG) and agile workflow practices in a collaborative team setting.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Agile']
    },
    {
      id: 'codealpha',
      company: 'CodeAlpha',
      role: 'Java Programming Intern',
      period: 'Jun 2024 - Jul 2024',
      startDate: 'June 2024',
      endDate: 'July 2024',
      location: 'Remote',
      highlights: [
        'Built multiple Java mini-projects applying core OOP principles (encapsulation, inheritance, polymorphism, abstraction).',
        'Solved algorithmic challenges to strengthen problem-solving efficiency and runtime optimization.',
        'Took part in peer code reviews, improving code readability, exception handling, and documentation practices.'
      ],
      technologies: ['Java', 'OOP', 'Data Structures', 'Algorithmic Problem Solving', 'Code Reviews']
    },
    {
      id: 'remarkskill',
      company: 'Remarkskill Education',
      role: 'Web Development Intern',
      period: 'Jun 2024 - Jul 2024',
      startDate: 'June 2024',
      endDate: 'July 2024',
      location: 'Remote',
      highlights: [
        'Delivered live web development projects under mentorship, following a real-world development workflow.',
        'Designed and deployed mobile-first, responsive interfaces tailored for optimal touch-screen navigation.',
        'Worked across the full project lifecycle from initial requirements gathering to final quality delivery.'
      ],
      technologies: ['HTML5', 'CSS3', 'Mobile-First Design', 'JavaScript', 'Client Delivery']
    }
  ];

  const internships = Array.isArray(internshipsData) ? internshipsData : defaultInternships;

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-midnight-surface/50 border-t border-midnight-border">
      <div className="max-w-5xl mx-auto text-left">
        {/* Section Header */}
        <div className="space-y-3 mb-16">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">

            <span>Experience</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            Internships
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted max-w-2xl">
            Three internships in web development and Java programming.
          </p>
        </div>

        {/* Timeline Container */}
        {internships.length === 0 ? (
          <div className="card-dev rounded-3xl p-10 sm:p-14 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-cyan" />
            <h3 className="mt-3 font-heading text-2xl sm:text-3xl text-slate-main uppercase tracking-wide">
              No experience entries published yet
            </h3>
            <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-slate-muted">
              Internship and professional experience details will appear here once they are added.
            </p>
          </div>
        ) : (
        <div className="relative pl-6 sm:pl-10 border-l-2 border-midnight-border space-y-12">
          {internships.map((internship, index) => (
            <div key={internship.id || index} className="relative group">
              {/* Luminous Timeline Node Marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-midnight border-2 border-cyan group-hover:scale-110 group-hover:shadow-glow-cyan flex items-center justify-center transition-all duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan" />
              </div>

              {/* Main Card */}
              <div className="card-dev rounded-3xl p-6 sm:p-8 space-y-4">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-midnight-border gap-2">
                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase">
                      {internship.role}
                    </h3>
                    <div className="font-mono-tech text-sm text-cyan font-bold tracking-wider uppercase">
                      {internship.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-slate-muted">
                    <span className="flex items-center gap-1 bg-midnight-elevated px-3 py-1 rounded-full border border-midnight-border">
                      <Calendar className="w-3.5 h-3.5 text-cyan" />
                      {internship.period}
                    </span>
                    <span className="flex items-center gap-1 bg-midnight-elevated px-3 py-1 rounded-full border border-midnight-border">
                      <MapPin className="w-3.5 h-3.5 text-violet" />
                      {internship.location || 'Remote'}
                    </span>
                  </div>
                </div>

                {/* Verified Points */}
                <div className="space-y-2">
                  <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-semibold">
                    What I worked on
                  </span>
                  <ul className="space-y-2">
                    {(Array.isArray(internship.highlights) ? internship.highlights : []).map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-slate-muted">
                        <CheckCircle2 className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Chips */}
                <div className="pt-4 border-t border-midnight-border flex flex-wrap items-center gap-2">
                  <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider mr-1">
                    Environment:
                  </span>
                  {(Array.isArray(internship.technologies) ? internship.technologies : []).map((tech, tIdx) => (
                    <span
                      key={`${tech}-${tIdx}`}
                      className="px-2.5 py-1 rounded-full bg-midnight-elevated border border-midnight-border text-[11px] font-mono-tech text-slate-main"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {internship.certificateUrl && (
                  <button type="button" onClick={() => setCertificatePreview(internship)} aria-label={`View ${internship.company} internship certificate`} className="btn-secondary px-4 py-2 rounded-xl inline-flex items-center gap-2 text-sm">
                    <FileText size={16} />View certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      {certificatePreview && <CertificateViewer url={certificatePreview.certificateUrl} fileType={certificatePreview.certificateType} title={`${certificatePreview.company} certificate`} onClose={() => setCertificatePreview(null)} />}
    </section>
  );
};

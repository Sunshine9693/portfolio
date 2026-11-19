import { Sparkles, GraduationCap, BookOpen, CheckCircle2, Trophy } from 'lucide-react';

export const Education = ({ educationData, achievementsData }) => {
  const education = educationData || {
    degree: 'B.Tech in Computer Science & Engineering',
    university: 'Maulana Azad National Urdu University (MANUU)',
    location: 'Hyderabad, India',
    expectedGraduation: '2027',
    cgpa: '8.72',
    keyAreas: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (Java & C++)',
      'Database Management Systems & SQL',
      'Web Development & Modern Full-Stack Technologies',
      'Artificial Intelligence & Foundational Machine Learning'
    ]
  };

  const defaultAchievements = [
    {
      id: 'cgpa',
      title: "Academic progress",
      metric: '8.72 CGPA',
      tag: 'Academic Track Record',
      description: 'Maintained a cumulative grade point average above 8.5 throughout the B.Tech CSE program at MANUU.'
    },
    {
      id: 'triple-internship',
      title: "Three internships",
      metric: '3 Internships',
      tag: 'Web development and Java',
      description: "Completed three internships in web development and Java programming."
    },
    {
      id: 'ssoc-contributor',
      title: 'Open Source Contributor — SSoC',
      metric: 'SSoC Contributor',
      tag: 'Developer Community',
      description: "Contributed documentation, guides, and translations through Social Summer of Code."
    },
    {
      id: 'react-hyd',
      title: 'React Hyderabad Community',
      metric: 'Volunteer Member',
      tag: 'Tech Community',
      description: "Volunteer with React Hyderabad, taking part in meetups and technical sessions."
    },
    {
      id: 'active-github',
      title: "Personal projects",
      metric: '5+ Projects',
      tag: 'Open Code',
      description: "My GitHub includes a voice assistant, web applications, and JavaScript projects."
    }
  ];

  const achievements = Array.isArray(achievementsData) ? achievementsData : defaultAchievements;

  return (
    <section id="education" className="relative py-24 px-4 sm:px-6 lg:px-8 ambient-glow-section">
      <div className="max-w-7xl mx-auto text-left space-y-16">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">

            <span>Education</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            Education & community
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            My degree, academic progress, and community involvement.
          </p>
        </div>

        {/* Education Highlight Card */}
        <div className="relative rounded-3xl card-dev p-6 sm:p-10 shadow-card-dev overflow-hidden border-cyan/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-elevated border border-cyan/30 text-xs font-mono-tech text-cyan">
                <GraduationCap className="w-4 h-4 text-cyan" />
                <span>Undergraduate degree</span>
              </div>

              <div>
                <h3 className="font-heading text-3xl sm:text-5xl text-slate-main tracking-wide uppercase leading-tight">
                  {education.degree}
                </h3>
                <div className="font-mono-tech text-sm sm:text-base text-cyan font-bold tracking-wider mt-1 uppercase">
                  {education.university}
                </div>
                <div className="font-mono-tech text-xs text-slate-muted mt-1">
                  {education.location} • Expected Graduation: {education.expectedGraduation}
                </div>
              </div>

              {/* Core Coursework Areas */}
              <div className="space-y-2 pt-2">
                <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan" /> Key Academic Study Areas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(education.keyAreas) ? education.keyAreas : []).map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-midnight-elevated border border-midnight-border text-xs font-sans text-slate-main"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: CGPA Box */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-midnight-elevated border border-cyan/40 text-center space-y-2 shadow-glow-subtle">
                <span className="font-mono-tech text-xs text-slate-muted uppercase tracking-widest font-semibold">
                  Cumulative GPA
                </span>
                <div className="font-heading text-6xl sm:text-7xl text-cyan leading-none">
                  {education.cgpa}
                </div>
                <div className="font-mono-tech text-xs text-slate-main uppercase font-bold">
                  Scale: 10.0
                </div>
                <div className="pt-2 border-t border-midnight-border text-[11px] font-sans text-slate-muted">
                  Consistently maintained above 8.5 across all evaluated semesters.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Achievements Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan" />
            <span className="font-mono-tech text-xs text-slate-main uppercase tracking-widest font-bold">
              Achievements & community
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.length === 0 ? (
              <div className="card-dev rounded-2xl p-8 text-center md:col-span-2 lg:col-span-3">
                <p className="font-sans text-sm text-slate-muted">
                  Achievements will appear here once they are added through the admin portal.
                </p>
              </div>
            ) : achievements.map((item, idx) => (
              <div
                key={item.id || idx}
                className="card-dev rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
                    <span className="font-mono-tech text-[10px] text-cyan uppercase tracking-wider font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  <div className="font-heading text-3xl text-slate-main tracking-wide">
                    {item.metric}
                  </div>

                  <h4 className="font-heading text-xl text-slate-main tracking-wide uppercase">
                    {item.title}
                  </h4>

                  <p className="font-sans text-xs sm:text-sm text-slate-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-midnight-border flex items-center gap-1.5 font-mono-tech text-[10px] text-emerald-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>From my resume</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

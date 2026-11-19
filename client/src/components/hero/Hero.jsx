import { useEffect, useState } from 'react';

import { FileDown } from 'lucide-react';

import { resolveAssetUrl } from '../../services/api';



const DEFAULT_STATS = [

  { label: 'CGPA', value: '8.72', sublabel: 'B.Tech Computer Science' },

  { label: 'Internships', value: '3', sublabel: 'Web development and Java' },

  { label: 'Projects', value: '5', sublabel: 'Web applications and AI' },

  { label: 'Graduation', value: '2027', sublabel: 'MANUU, Hyderabad' },

];

const safeText = (value, fallback) =>

  typeof value === 'string' && value.trim() ? value.trim() : fallback;



export const Hero = ({ heroData, educationData }) => {

  const [imgError, setImgError] = useState(false);

  const name = safeText(heroData?.name, 'Sana Fatma');

  const headline = safeText(heroData?.headline, 'I build web applications and work with AI.');

  const supportingCopy = safeText(heroData?.supportingCopy,

    "I'm a Computer Science student at MANUU, graduating in 2027. My work includes React applications, backend services, and a voice assistant built with language model APIs.");

  const portraitSrc = resolveAssetUrl(heroData?.portraitUrl) || '/images/sana_portrait.jpg';

  const resumeUrl = resolveAssetUrl(heroData?.resumeUrl) || '/Sana_Fatma_Resume.pdf';

  const stats = Array.isArray(heroData?.stats) && heroData.stats.length

    ? heroData.stats.filter((stat) => stat && typeof stat === 'object') : DEFAULT_STATS;

  const university = safeText(educationData?.university, 'Maulana Azad National Urdu University');

  useEffect(() => { setImgError(false); }, [portraitSrc]);



  return (

    <section id="hero" className="relative pt-36 sm:pt-44 pb-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          <div className="lg:col-span-7 space-y-6">

            <p className="text-sm font-medium text-cyan">Computer Science student · Web development & AI</p>

            <h1 className="font-heading text-[clamp(3rem,6vw,5rem)] leading-[1.08] text-slate-main">{name}</h1>

            <h2 className="text-2xl sm:text-3xl font-medium leading-snug tracking-tight text-slate-main max-w-xl">{headline}</h2>

            <p className="text-base sm:text-lg text-slate-muted leading-relaxed max-w-xl">{supportingCopy}</p>

            <div className="flex flex-wrap gap-3 pt-3">

              <a href="#projects" className="btn-primary px-6 py-3 text-sm inline-flex items-center">View projects</a>

              <a href={resumeUrl} download="Sana_Fatma_Resume.pdf" className="btn-secondary px-6 py-3 text-sm inline-flex items-center gap-2">

                <FileDown className="w-4 h-4" /> Download resume

              </a>

              <a href="#contact" className="px-3 py-3 text-sm font-medium text-cyan underline underline-offset-4">Get in touch</a>

            </div>

            <p className="text-sm text-slate-muted pt-2">Open to internships and graduate software roles.</p>

          </div>

          <figure className="lg:col-span-5 w-full max-w-sm mx-auto lg:ml-auto lg:mr-0">

            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-midnight-border bg-midnight-elevated">

              {!imgError ? <img src={portraitSrc} alt={name} onError={() => setImgError(true)} className="w-full h-full object-cover object-center" />

                : <div className="h-full flex items-center justify-center text-6xl font-heading text-cyan">SF</div>}

            </div>

            <figcaption className="mt-4 text-sm text-slate-muted leading-relaxed">B.Tech in Computer Science & Engineering<br />{university}</figcaption>

          </figure>

        </div>

        <dl className="mt-16 pt-8 border-t border-midnight-border grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">

          {stats.map((stat, index) => <div key={`${stat.label}-${index}`}>

            <dd className="text-3xl font-heading text-slate-main mb-1">{stat.value || '—'}</dd>

            <dt className="text-sm font-medium text-cyan">{stat.label}</dt>

            <dd className="text-sm text-slate-muted mt-1">{stat.sublabel}</dd>

          </div>)}

        </dl>

      </div>

    </section>

  );

};

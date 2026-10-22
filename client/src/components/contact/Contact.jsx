import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, Send, FileDown, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from '../common/Icons';

export const Contact = ({ socialLinksData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const email = socialLinksData?.email || 'sanathesunshine9693@gmail.com';
  const phone = socialLinksData?.phone || '+91 7479895668';
  const github = socialLinksData?.github || 'https://github.com/sanathesunshine';
  const linkedin = socialLinksData?.linkedin || 'https://linkedin.com';
  const location = socialLinksData?.location || 'Hyderabad, India';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setFeedbackMessage('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('submitting');
      const res = await axios.post('/api/contact', formData);

      if (res.data?.success) {
        setStatus('success');
        setFeedbackMessage('Message received! Thank you for reaching out — Sana will review your inquiry shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#38BDF8', '#818CF8', '#A78BFA']
          });
        } catch (e) {
          // ignore confetti errors
        }
      } else {
        setStatus('error');
        setFeedbackMessage(res.data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setStatus('error');
      setFeedbackMessage(err.response?.data?.message || 'Could not send message. Please reach out directly via email.');
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 ambient-glow-hero border-t border-midnight-border">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="space-y-3 mb-16 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-violet" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            LET'S CONNECT
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            Open for software engineering roles, web development opportunities, and collaborative AI projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Direct Info & Verified Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-dev rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase">
                CONTACT DETAILS
              </h3>

              <div className="space-y-4">
                {/* Email Link */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-midnight-elevated border border-midnight-border hover:border-cyan/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-midnight-card border border-cyan/30 flex items-center justify-center text-cyan shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider block">
                      Direct Email
                    </span>
                    <span className="font-sans text-sm sm:text-base text-slate-main group-hover:text-cyan transition-colors font-medium break-all">
                      {email}
                    </span>
                  </div>
                </a>

                {/* Phone Link */}
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-midnight-elevated border border-midnight-border hover:border-cyan/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-midnight-card border border-indigo/30 flex items-center justify-center text-indigo shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider block">
                      Direct Phone
                    </span>
                    <span className="font-sans text-sm sm:text-base text-slate-main group-hover:text-cyan transition-colors font-medium">
                      {phone}
                    </span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-midnight-elevated border border-midnight-border">
                  <div className="w-10 h-10 rounded-xl bg-midnight-card border border-midnight-border flex items-center justify-center text-slate-main shrink-0">
                    <MapPin className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider block">
                      Location
                    </span>
                    <span className="font-sans text-sm sm:text-base text-slate-main font-medium">
                      {location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links & Resume Download */}
              <div className="pt-4 border-t border-midnight-border flex flex-wrap gap-3">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-mono-tech uppercase flex items-center gap-2 hover:border-cyan/50 hover:text-cyan"
                >
                  <Github className="w-4 h-4 text-slate-main" />
                  <span>GitHub</span>
                </a>

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-mono-tech uppercase flex items-center gap-2 hover:border-indigo/50 hover:text-indigo"
                >
                  <Linkedin className="w-4 h-4 text-indigo" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="/Sana_Fatma_Resume.pdf"
                  download="Sana_Fatma_Resume.pdf"
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Get Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="card-dev rounded-3xl p-6 sm:p-10 shadow-card-dev relative overflow-hidden">
              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase mb-2">
                SEND A MESSAGE
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-muted mb-8">
                Your message is stored securely and delivered to Sana's dashboard inbox.
              </p>

              {/* Status Alert Banners */}
              {status === 'success' && (
                <div className="mb-6 p-4 rounded-2xl bg-midnight-elevated border border-emerald-500/50 flex items-start gap-3 text-slate-main text-xs font-mono-tech">
                  <CheckCircle2 className="w-5 h-5 text-emerald-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-accent block mb-0.5">Submission Successful</span>
                    {feedbackMessage}
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-slate-main text-xs font-mono-tech">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-400 block mb-0.5">Submission Error</span>
                    {feedbackMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Mercer"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Opportunity Discussion / Project Collaboration"
                    className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block">
                    Message Content *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full py-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Submitting Message...' : 'Send Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

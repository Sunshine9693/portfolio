import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, FileDown, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from '../common/Icons';
import api, { isApiCancel, resolveAssetUrl } from '../../services/api';

const NAME_MIN = 2;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const SUBJECT_MAX = 150;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 3000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const Contact = ({ socialLinksData, resumeUrl }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const isSubmittingRef = useRef(false);

  const email = socialLinksData?.email || 'sanathesunshine9693@gmail.com';
  const phone = socialLinksData?.phone || '+91 7479895668';
  const github = socialLinksData?.github || 'https://github.com/sanathesunshine';
  const linkedin = socialLinksData?.linkedin || 'https://linkedin.com';
  const location = socialLinksData?.location || 'Hyderabad, India';
  const resolvedResumeUrl = resolveAssetUrl(resumeUrl) || '/Sana_Fatma_Resume.pdf';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const showError = (message) => {
    setStatus('error');
    setFeedbackMessage(message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const name = formData.name.trim();
    const normalizedEmail = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !normalizedEmail || !message) {
      showError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      showError(`Name must be between ${NAME_MIN} and ${NAME_MAX} characters.`);
      return;
    }

    if (normalizedEmail.length > EMAIL_MAX || !EMAIL_PATTERN.test(normalizedEmail)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (subject.length > SUBJECT_MAX) {
      showError(`Subject must be ${SUBJECT_MAX} characters or fewer.`);
      return;
    }

    if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
      showError(`Message must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`);
      return;
    }

    isSubmittingRef.current = true;
    setStatus('submitting');
    setFeedbackMessage('');

    try {
      const res = await api.post('/api/contact', {
        name,
        email: normalizedEmail,
        subject: subject || 'Portfolio Inquiry',
        message,
      });

      if (res.data?.success) {
        setStatus('success');
        setFeedbackMessage(
          'Thanks for your message. I’ll get back to you as soon as I can.'
        );
        setFormData(EMPTY_FORM);

      } else {
        showError(res.data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Contact submit error:', error);

      if (isApiCancel(error)) return;

      const messageText =
        error.code === 'ECONNABORTED'
          ? 'The request timed out. Please check your connection and try again.'
          : error.response?.data?.message ||
            'Could not send message. Please reach out directly via email.';

      showError(messageText);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 ambient-glow-hero border-t border-midnight-border">
      <div className="max-w-7xl mx-auto text-left">
        {/* Section Header */}
        <div className="space-y-3 mb-16 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan font-mono-tech text-xs uppercase tracking-widest font-bold">

            <span>Contact</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl text-slate-main tracking-tight uppercase leading-none">
            Get in touch
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-muted">
            Have a role or project in mind? I’d be glad to hear about it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Direct Info & Verified Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-dev rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase">
                Contact details
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
                  <div className="min-w-0">
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider block">
                      Email
                    </span>
                    <span className="font-sans text-sm sm:text-base text-slate-main group-hover:text-cyan transition-colors font-medium break-all">
                      {email}
                    </span>
                  </div>
                </a>

                {/* Phone Link */}
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-midnight-elevated border border-midnight-border hover:border-cyan/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-midnight-card border border-indigo/30 flex items-center justify-center text-indigo shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono-tech text-[10px] text-slate-muted uppercase tracking-wider block">
                      Phone
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
                  <div className="min-w-0">
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
                  href={resolvedResumeUrl}
                  download="Sana_Fatma_Resume.pdf"
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="card-dev rounded-3xl p-6 sm:p-10 shadow-card-dev relative overflow-hidden">
              <h3 className="font-heading text-2xl sm:text-3xl text-slate-main tracking-wide uppercase mb-2">
                Send a message
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-muted mb-8">
                Send me a message, or use the email address alongside this form.
              </p>

              {/* Status Alert Banners */}
              <div aria-live="polite">
                {status === 'success' && (
                  <div className="mb-6 p-4 rounded-2xl bg-midnight-elevated border border-emerald-500/50 flex items-start gap-3 text-slate-main text-xs font-mono-tech">
                    <CheckCircle2 className="w-5 h-5 text-emerald-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-accent block mb-0.5">Message sent</span>
                      {feedbackMessage}
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-slate-main text-xs font-mono-tech">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-400 block mb-0.5">Message not sent</span>
                      {feedbackMessage}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block"
                    >
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      minLength={NAME_MIN}
                      maxLength={NAME_MAX}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      autoComplete="email"
                      maxLength={EMAIL_MAX}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What would you like to discuss?"
                    autoComplete="off"
                    maxLength={SUBJECT_MAX}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="contact-message"
                      className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block"
                    >
                      Message *
                    </label>
                    <span className="font-mono-tech text-[10px] text-slate-muted/70">
                      {formData.message.length} / {MESSAGE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    minLength={MESSAGE_MIN}
                    maxLength={MESSAGE_MAX}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main font-sans text-sm focus:outline-none focus:border-cyan transition-colors placeholder:text-slate-muted/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full py-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Sending…' : 'Send message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

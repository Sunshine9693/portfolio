import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Shield, LogOut, ArrowLeft, Save, Upload, Trash2,
  CheckCircle2, AlertCircle, FileText, Eye, Key, User, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { admin, token, isAuthenticated, isAuthLoading, login, setupAdmin, logout } = useAuth();
  const { data: portfolioData, refreshData, updateSectionData } = usePortfolio();

  // Auth form states
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'setup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState('hero');

  // Working copy states for editing
  const [heroForm, setHeroForm] = useState(null);
  const [aboutForm, setAboutForm] = useState(null);
  const [skillsForm, setSkillsForm] = useState([]);
  const [projectsForm, setProjectsForm] = useState([]);
  const [messages, setMessages] = useState([]);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync working copy when portfolioData is loaded
  useEffect(() => {
    if (portfolioData) {
      setHeroForm(portfolioData.hero || {});
      setAboutForm(portfolioData.about || {});
      setSkillsForm(portfolioData.skills || []);
      setProjectsForm(portfolioData.projects || []);
    }
  }, [portfolioData]);

  // Load contact messages when inbox tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'inbox' && token) {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab, token]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/contact/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth actions
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);
    const res = await login(username, password);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      showToast('success', 'Logged in successfully!');
    }
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);
    const res = await setupAdmin(setupToken, username, email, password);
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      showToast('success', 'Initial Administrator account initialized successfully!');
    }
  };

  // File uploader
  const handleFileUpload = async (e, onComplete) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsSaving(true);
      const res = await axios.post('/api/content/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data?.success) {
        onComplete(res.data.fileUrl);
        showToast('success', `File ${file.name} uploaded successfully!`);
      } else {
        showToast('error', res.data?.message || 'File upload failed');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Upload error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save section handler
  const saveSection = async (sectionName, sectionData) => {
    setIsSaving(true);
    const res = await updateSectionData(sectionName, sectionData, token);
    setIsSaving(false);
    if (res.success) {
      showToast('success', `Updated ${sectionName} successfully!`);
      refreshData();
    } else {
      showToast('error', res.message || 'Update failed');
    }
  };

  const deleteMessageItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await axios.delete(`/api/contact/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        showToast('success', 'Message deleted');
      }
    } catch (err) {
      showToast('error', 'Failed to delete message');
    }
  };

  // --------------------------------------------------------------------------
  // UNAUTHENTICATED VIEW: SIGN IN OR SECURE INITIAL SETUP
  // --------------------------------------------------------------------------
  if (!isAuthenticated && !isAuthLoading) {
    return (
      <div className="admin-dashboard min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="max-w-md w-full card-dev rounded-3xl p-8 shadow-card-dev-hover text-left relative overflow-hidden border-cyan/30">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-midnight-elevated border border-cyan/40 flex items-center justify-center text-cyan shadow-glow-subtle">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                ADMIN CONTROL PORTAL
              </h2>
              <p className="font-mono-tech text-xs text-slate-muted">
                Sana Fatma Portfolio Management
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-midnight-surface p-1 border border-midnight-border mb-6">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-mono-tech uppercase font-bold transition-all ${
                authMode === 'login' ? 'bg-cyan text-midnight shadow-sm' : 'text-slate-muted hover:text-slate-main'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('setup'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-mono-tech uppercase font-bold transition-all ${
                authMode === 'setup' ? 'bg-cyan text-midnight shadow-sm' : 'text-slate-muted hover:text-slate-main'
              }`}
            >
              Initial Setup
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono-tech text-slate-main flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="sana"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="btn-primary w-full py-3 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-glow-cyan"
              >
                <span>{isSubmittingAuth ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          ) : (
            /* One-Time Secure Setup Form */
            <form onSubmit={handleSetupSubmit} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-midnight-surface border border-midnight-border text-[11px] font-sans text-slate-muted">
                Requires the <code className="text-cyan">ADMIN_SETUP_TOKEN</code> configured in <code className="text-slate-main">server/.env</code>.
              </div>

              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Setup Token *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    placeholder="Enter ADMIN_SETUP_TOKEN from .env"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Admin Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sana"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                />
              </div>

              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sanathesunshine9693@gmail.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                />
              </div>

              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="btn-primary w-full py-3 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-glow-cyan"
              >
                <span>{isSubmittingAuth ? 'Initializing...' : 'Complete Initial Setup'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-midnight-border text-center">
            <Link
              to="/"
              className="text-xs font-mono-tech text-slate-muted hover:text-cyan inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="admin-dashboard min-h-screen bg-midnight text-slate-main text-left pb-20">
      {/* Toast notification banner */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border text-xs font-mono-tech flex items-center gap-3 shadow-2xl animate-fade-in ${
            toast.type === 'success'
              ? 'bg-midnight-card border-cyan text-slate-main shadow-glow-cyan'
              : 'bg-midnight-card border-rose-500 text-rose-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-accent shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-midnight-surface/90 backdrop-blur-md border-b border-midnight-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-full border border-midnight-border text-slate-muted hover:text-slate-main transition-colors"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl text-slate-main tracking-wide uppercase leading-none">
              ADMIN CONTROL PANEL
            </h1>
            <span className="font-mono-tech text-[10px] text-slate-muted">
              Authenticated as: <strong className="text-cyan">{admin?.username || 'sana'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-midnight-border text-xs font-mono-tech text-slate-main hover:border-cyan/50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={logout}
            className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-mono-tech uppercase flex items-center gap-1.5 hover:border-rose-500/50 text-slate-muted hover:text-rose-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex gap-2 overflow-x-auto pb-4 border-b border-midnight-border no-scrollbar">
          {[
            { id: 'hero', label: 'Hero & Identity' },
            { id: 'about', label: 'About & Voice Script' },
            { id: 'skills', label: 'Skills Matrix' },
            { id: 'projects', label: 'Projects Showcase' },
            { id: 'inbox', label: `Inquiries (${messages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan text-midnight font-bold shadow-glow-cyan'
                  : 'bg-midnight-elevated border border-midnight-border text-slate-muted hover:text-slate-main'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HERO & IDENTITY */}
        {activeTab === 'hero' && heroForm && (
          <div className="mt-8 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                HERO & BIOGRAPHICAL IDENTITY
              </h2>
              <button
                onClick={() => saveSection('hero', heroForm)}
                disabled={isSaving}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Hero Changes'}</span>
              </button>
            </div>

            <div className="card-dev rounded-3xl p-6 sm:p-8 space-y-6">
              {/* Profile Photo Uploader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-midnight-border">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-midnight-elevated border border-midnight-border shrink-0">
                  <img
                    src={heroForm.portraitUrl || '/images/sana_portrait.jpg'}
                    alt="Sana Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <span className="font-mono-tech text-xs text-slate-main uppercase font-bold block">
                    Update Profile Portrait
                  </span>
                  <p className="font-sans text-xs text-slate-muted">
                    Upload an authentic portrait photo (PNG, JPG, WebP).
                  </p>
                  <label className="btn-secondary px-4 py-2 rounded-xl text-xs font-mono-tech uppercase inline-flex items-center gap-2 cursor-pointer hover:border-cyan/50 hover:text-cyan">
                    <Upload className="w-3.5 h-3.5 text-cyan" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setHeroForm(prev => ({ ...prev, portraitUrl: url })))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Resume PDF Uploader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-midnight-border">
                <div className="w-12 h-12 rounded-xl bg-midnight-elevated border border-cyan/30 flex items-center justify-center text-cyan shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono-tech text-xs text-slate-main uppercase font-bold block">
                    Verified Resume Document
                  </span>
                  <span className="font-mono-tech text-xs text-slate-muted block">
                    Current: {heroForm.resumeUrl || '/Sana_Fatma_Resume.pdf'}
                  </span>
                  <label className="btn-secondary px-4 py-1.5 rounded-xl text-xs font-mono-tech uppercase inline-flex items-center gap-2 cursor-pointer mt-2 hover:border-cyan/50 hover:text-cyan">
                    <Upload className="w-3.5 h-3.5 text-cyan" />
                    <span>Replace Resume PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setHeroForm(prev => ({ ...prev, resumeUrl: url })))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1.5">
                  Main Hero Headline
                </label>
                <input
                  type="text"
                  value={heroForm.headline || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                />
              </div>

              {/* Supporting Copy */}
              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1.5">
                  Supporting Introduction
                </label>
                <textarea
                  rows={3}
                  value={heroForm.supportingCopy || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, supportingCopy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan resize-none"
                />
              </div>

              {/* Cycling Roles */}
              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1.5">
                  Animated Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={(heroForm.roles || []).join(', ')}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      roles: e.target.value.split(',').map((r) => r.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT & VOICE SCRIPT */}
        {activeTab === 'about' && aboutForm && (
          <div className="mt-8 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                ABOUT ME & VOICE NARRATION SCRIPT
              </h2>
              <button
                onClick={() => saveSection('about', aboutForm)}
                disabled={isSaving}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save About Changes'}</span>
              </button>
            </div>

            <div className="card-dev rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1.5">
                  Written Biography
                </label>
                <textarea
                  rows={5}
                  value={aboutForm.bio || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block">
                    Speech Narration Script
                  </label>
                  <span className="text-[11px] font-mono-tech text-cyan">
                    Spoken by AURA virtual guide
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={aboutForm.narrationScript || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, narrationScript: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-elevated border border-midnight-border text-slate-main text-xs font-sans focus:outline-none focus:border-cyan leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div className="mt-8 space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                SKILLS CATEGORIES & ITEMS
              </h2>
              <button
                onClick={() => saveSection('skills', skillsForm)}
                disabled={isSaving}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Skills Changes'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {skillsForm.map((category, catIdx) => (
                <div key={category.id || catIdx} className="card-dev rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
                    <span className="font-heading text-xl text-slate-main uppercase">
                      {category.category}
                    </span>
                    <span className="text-xs font-mono-tech text-cyan">{category.tag}</span>
                  </div>

                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">
                      Category Description
                    </label>
                    <input
                      type="text"
                      value={category.description || ''}
                      onChange={(e) => {
                        const updated = [...skillsForm];
                        updated[catIdx].description = e.target.value;
                        setSkillsForm(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div>
                    <span className="font-mono-tech text-xs text-slate-muted block mb-2">
                      Technologies ({category.items.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="p-2.5 rounded-xl bg-midnight-elevated border border-midnight-border flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-main font-mono-tech block">{item.name}</span>
                            <span className="text-[10px] text-slate-muted">{item.focus}</span>
                          </div>
                          <button
                            onClick={() => {
                              const updated = [...skillsForm];
                              updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
                              setSkillsForm(updated);
                            }}
                            className="text-slate-muted hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS SHOWCASE */}
        {activeTab === 'projects' && (
          <div className="mt-8 space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                DOCUMENTED PROJECTS
              </h2>
              <button
                onClick={() => saveSection('projects', projectsForm)}
                disabled={isSaving}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Projects'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {projectsForm.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="card-dev rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-midnight-border">
                    <div>
                      <span className="font-heading text-xl text-slate-main uppercase">{proj.title}</span>
                      <span className="text-xs font-mono-tech text-cyan block">{proj.type} • {proj.status}</span>
                    </div>
                    <span className="font-mono-tech text-xs text-slate-muted">ID: {proj.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-tech text-xs text-slate-muted block mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) => {
                          const updated = [...projectsForm];
                          updated[pIdx].githubUrl = e.target.value;
                          setProjectsForm(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                      />
                    </div>
                    <div>
                      <label className="font-mono-tech text-xs text-slate-muted block mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => {
                          const updated = [...projectsForm];
                          updated[pIdx].liveUrl = e.target.value;
                          setProjectsForm(updated);
                        }}
                        placeholder="Leave blank if not deployed"
                        className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => {
                        const updated = [...projectsForm];
                        updated[pIdx].description = e.target.value;
                        setProjectsForm(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: INQUIRIES INBOX */}
        {activeTab === 'inbox' && (
          <div className="mt-8 space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                SUBMITTED CONTACT INQUIRIES ({messages.length})
              </h2>
              <button
                onClick={fetchMessages}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-mono-tech uppercase hover:text-cyan"
              >
                Refresh Messages
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="card-dev rounded-3xl p-12 text-center text-slate-muted font-mono-tech text-xs">
                No inquiries submitted yet. Form submissions will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="card-dev rounded-2xl p-6 space-y-3">
                    <div className="flex items-start justify-between pb-3 border-b border-midnight-border">
                      <div>
                        <span className="font-heading text-xl text-slate-main uppercase">{msg.name}</span>
                        <div className="font-mono-tech text-xs text-cyan">{msg.email}</div>
                        <span className="font-mono-tech text-[10px] text-slate-muted">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMessageItem(msg._id)}
                        className="p-2 text-slate-muted hover:text-rose-400 border border-midnight-border rounded-xl"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono-tech text-xs text-slate-main font-bold block">
                        Subject: {msg.subject}
                      </span>
                      <p className="font-sans text-xs text-slate-muted leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

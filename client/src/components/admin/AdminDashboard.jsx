import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, LogOut, ArrowLeft, Save, Upload, Trash2,
  CheckCircle2, AlertCircle, FileText, Eye, Key, User, Lock, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import api, { isApiCancel, resolveAssetUrl } from '../../services/api';
import './AdminDashboard.css';
import { ProjectEditor } from './ProjectEditor';
import { ChangePassword } from './ChangePassword';

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
  const [certificateFile, setCertificateFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [certificateDraft, setCertificateDraft] = useState({ title: '', issuer: '', date: '', description: '', credentialUrl: '' });
  const [photoDraft, setPhotoDraft] = useState({ title: '', caption: '', category: '' });
  const [photoPreview, setPhotoPreview] = useState('');
  const certificateFileInput = useRef(null);
  const photoFileInput = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesLoadError, setMessagesLoadError] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, message) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);

    setToast({ type, message });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    },
    []
  );

  // Sync working copy when portfolioData is loaded.
  useEffect(() => {
    if (!portfolioData) return;

    setHeroForm(
      portfolioData.hero && typeof portfolioData.hero === 'object' && !Array.isArray(portfolioData.hero)
        ? portfolioData.hero
        : {}
    );
    setAboutForm(
      portfolioData.about && typeof portfolioData.about === 'object' && !Array.isArray(portfolioData.about)
        ? portfolioData.about
        : {}
    );
    setSkillsForm(Array.isArray(portfolioData.skills) ? portfolioData.skills : []);
    setProjectsForm(Array.isArray(portfolioData.projects) ? portfolioData.projects : []);
  }, [portfolioData]);

  // Release the local preview URL when it is replaced or the view unmounts.
  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview]
  );

  const fetchMessages = useCallback(async () => {
    if (!token) return;

    setIsLoadingMessages(true);
    setMessagesLoadError(false);

    try {
      const res = await api.get('/api/contact/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
      } else {
        setMessagesLoadError(true);
        showToast('error', res.data?.message || 'Could not load contact messages.');
      }
    } catch (error) {
      if (isApiCancel(error)) return;
      setMessagesLoadError(true);
      console.error('Failed to fetch contact messages:', error);
      showToast('error', error.response?.data?.message || 'Could not load contact messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [token, showToast]);

  // Load contact messages when inbox tab is active.
  useEffect(() => {
    if (isAuthenticated && activeTab === 'inbox' && token) {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab, token, fetchMessages]);

  // Auth actions
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingAuth) return;

    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      const res = await login(username.trim(), password);
      if (!res.success) {
        setAuthError(res.message || 'Invalid username or password.');
        return;
      }
      setPassword('');
      showToast('success', 'Logged in successfully!');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSetupSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingAuth) return;

    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      const res = await setupAdmin(setupToken.trim(), username.trim(), email.trim(), password);
      if (!res.success) {
        setAuthError(res.message || 'Setup failed.');
        return;
      }
      setPassword('');
      setSetupToken('');
      showToast('success', 'Initial Administrator account initialized successfully!');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // File uploader for the hero portrait and resume.
  const handleFileUpload = async (event, onComplete) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('error', 'The selected file is larger than the 4 MB limit.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsSaving(true);
      const res = await api.post('/api/content/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && res.data.fileUrl) {
        onComplete(res.data.fileUrl);
        showToast('success', `File ${file.name} uploaded successfully!`);
      } else {
        showToast('error', res.data?.message || 'File upload failed.');
      }
    } catch (error) {
      if (!isApiCancel(error)) {
        showToast('error', error.response?.data?.message || 'The file could not be uploaded.');
      }
    } finally {
      setIsSaving(false);
      input.value = '';
    }
  };

  // Save section handler.
  const saveSection = async (sectionName, sectionData) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const res = await updateSectionData(sectionName, sectionData, token);
      if (res.success) {
        showToast('success', `Updated ${sectionName} successfully!`);
        await refreshData();
      } else {
        showToast('error', res.message || 'Update failed.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAndSaveMedia = async ({ event, file, kind, section, item, onSaved }) => {
    event.preventDefault();
    if (isSaving) return;

    if (!file) {
      showToast('error', `Choose a ${kind === 'photo' ? 'photo' : 'certificate file'} first.`);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('error', 'The selected file is larger than the 4 MB limit.');
      return;
    }

    setIsSaving(true);
    let fileUrl = '';

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await api.post(`/api/content/media/${kind}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fileUrl = uploadResponse.data?.fileUrl || '';
      if (!uploadResponse.data?.success || !fileUrl) {
        throw new Error(uploadResponse.data?.message || 'The file could not be uploaded.');
      }

      const savedItem = section === 'gallery' ? { ...item, url: fileUrl } : { ...item, fileUrl };
      const existingItems = Array.isArray(portfolioData?.[section]) ? portfolioData[section] : [];
      const result = await updateSectionData(section, [...existingItems, savedItem], token);
      if (!result.success) {
        throw new Error(result.message || 'The uploaded item could not be saved.');
      }

      onSaved();
      await refreshData();
      showToast('success', `${kind === 'photo' ? 'Photo' : 'Certificate'} added successfully.`);
    } catch (error) {
      if (fileUrl) {
        try {
          const filename = fileUrl.split('/').pop();
          await api.delete(`/api/content/upload/${encodeURIComponent(filename)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (cleanupError) {
          console.error('Could not clean up an unsaved upload:', cleanupError);
        }
      }

      if (!isApiCancel(error)) {
        showToast(
          'error',
          error.response?.data?.message || error.message || 'Could not save the uploaded file.'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCertificate = (event) => {
    const title = certificateDraft.title.trim();
    if (!title) {
      event.preventDefault();
      showToast('error', 'Enter a certificate title first.');
      return;
    }

    uploadAndSaveMedia({
      event,
      file: certificateFile,
      kind: 'certificate',
      section: 'certificates',
      item: {
        id: `certificate-${Date.now()}`,
        ...certificateDraft,
        title,
        issuer: certificateDraft.issuer.trim(),
        date: certificateDraft.date.trim(),
        description: certificateDraft.description.trim(),
        credentialUrl: certificateDraft.credentialUrl.trim(),
        fileType: certificateFile?.type || '',
        verified: true,
      },
      onSaved: () => {
        setCertificateDraft({ title: '', issuer: '', date: '', description: '', credentialUrl: '' });
        setCertificateFile(null);
        if (certificateFileInput.current) certificateFileInput.current.value = '';
      },
    });
  };

  const handleAddPhoto = (event) => {
    const title = photoDraft.title.trim();
    if (!title) {
      event.preventDefault();
      showToast('error', 'Enter a photo title first.');
      return;
    }

    uploadAndSaveMedia({
      event,
      file: photoFile,
      kind: 'photo',
      section: 'gallery',
      item: {
        id: `photo-${Date.now()}`,
        type: 'photo',
        title,
        caption: photoDraft.caption.trim(),
        category: photoDraft.category.trim(),
      },
      onSaved: () => {
        setPhotoDraft({ title: '', caption: '', category: '' });
        setPhotoFile(null);
        setPhotoPreview('');
        if (photoFileInput.current) photoFileInput.current.value = '';
      },
    });
  };

  const handleDeleteMediaItem = async (section, item, label) => {
    if (isSaving) return;
    if (!window.confirm(`Delete this ${label.toLowerCase()} from your portfolio?`)) return;

    const currentItems = Array.isArray(portfolioData?.[section]) ? portfolioData[section] : [];
    const itemIndex = currentItems.indexOf(item);
    const updatedItems = item.id
      ? currentItems.filter((entry) => entry?.id !== item.id)
      : currentItems.filter((_, index) => index !== itemIndex);

    if (updatedItems.length === currentItems.length) {
      showToast('error', `The ${label.toLowerCase()} could not be found. Refresh and try again.`);
      return;
    }

    setIsSaving(true);
    let cleanupMessage = '';

    try {
      const result = await updateSectionData(section, updatedItems, token);
      if (!result.success) {
        showToast('error', result.message || `Could not delete the ${label.toLowerCase()}.`);
        return;
      }

      const fileUrl = section === 'certificates' ? item.fileUrl : item.url || item.fileUrl;
      if (typeof fileUrl === 'string' && fileUrl.startsWith('/uploads/')) {
        try {
          const filename = fileUrl.split('/').pop();
          await api.delete(`/api/content/upload/${encodeURIComponent(filename)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          cleanupMessage = error.response?.data?.message || 'The uploaded file could not be removed.';
        }
      }

      await refreshData();
      showToast(
        cleanupMessage ? 'error' : 'success',
        cleanupMessage
          ? `${label} removed from the portfolio, but its file remains: ${cleanupMessage}`
          : `${label} deleted successfully.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMessageItem = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await api.delete(`/api/contact/messages/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setMessages((previous) => previous.filter((message) => message._id !== id));
        showToast('success', 'Message deleted.');
      } else {
        showToast('error', res.data?.message || 'Could not delete the message.');
      }
    } catch (error) {
      if (!isApiCancel(error)) {
        showToast('error', error.response?.data?.message || 'Could not delete the message.');
      }
    }
  };

  const updateSkillCategory = (categoryIndex, updates) => {
    setSkillsForm((previous) =>
      previous.map((category, index) =>
        index === categoryIndex ? { ...category, ...updates } : category
      )
    );
  };

  const removeSkillItem = (categoryIndex, itemIndex) => {
    setSkillsForm((previous) =>
      previous.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              items: (Array.isArray(category.items) ? category.items : []).filter(
                (_, index_) => index_ !== itemIndex
              ),
            }
          : category
      )
    );
  };


  // --------------------------------------------------------------------------
  // SESSION VERIFICATION VIEW
  // --------------------------------------------------------------------------
  if (isAuthLoading) {
    return (
      <div className="admin-dashboard min-h-screen bg-midnight flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan via-indigo to-violet flex items-center justify-center font-heading text-xl text-midnight font-bold animate-pulse shadow-glow-cyan">
          SF
        </div>
        <p className="font-mono-tech text-xs text-slate-muted uppercase tracking-widest">
          Verifying admin session...
        </p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UNAUTHENTICATED VIEW: SIGN IN OR SECURE INITIAL SETUP
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
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
                Portfolio admin
              </h2>
              <p className="font-mono-tech text-xs text-slate-muted">
                Manage projects, photos, and certificates
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
                <label htmlFor="admin-username" className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-muted absolute left-3.5 top-3.5" />
                  <input
                    id="admin-username"
                    autoComplete="username"
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
                <label htmlFor="admin-password" className="font-mono-tech text-xs text-slate-muted uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-muted absolute left-3.5 top-3.5" />
                  <input
                    id="admin-password"
                    autoComplete="current-password"
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
      <header className="sticky top-0 z-40 bg-midnight-surface/90 backdrop-blur-md border-b border-midnight-border px-4 sm:px-8 py-3.5 flex flex-wrap gap-3 items-center justify-between">
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
            type="button"
            onClick={() => setActiveTab('security')}
            className="btn-secondary px-3 py-1.5 text-sm inline-flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" />
            <span>Change password</span>
          </button>
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
            { id: 'media', label: 'Certificates & Photos' },
            { id: 'inbox', label: `Inquiries (${messages.length})` },
            { id: 'security', label: 'Account security' },
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

        {activeTab === 'security' && <ChangePassword />}

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
                    src={resolveAssetUrl(heroForm.portraitUrl) || '/images/sana_portrait.jpg'}
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
                      onChange={(event) =>
                        updateSkillCategory(catIdx, { description: event.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div>
                    <span className="font-mono-tech text-xs text-slate-muted block mb-2">
                      Technologies ({(Array.isArray(category.items) ? category.items : []).length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(Array.isArray(category.items) ? category.items : []).map((item, itemIdx) => (
                        <div key={`${item?.name || 'skill'}-${itemIdx}`} className="p-2.5 rounded-xl bg-midnight-elevated border border-midnight-border flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-main font-mono-tech block">{item?.name}</span>
                            <span className="text-[10px] text-slate-muted">{item?.focus}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkillItem(catIdx, itemIdx)}
                            aria-label={`Remove ${item?.name || 'skill'}`}
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
                Projects
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

            <ProjectEditor projects={projectsForm} onChange={setProjectsForm} isSaving={isSaving} onUpload={handleFileUpload} />
          </div>
        )}

        {/* TAB 5: CERTIFICATES & PHOTOS */}
        {activeTab === 'media' && (
          <div className="mt-8 space-y-10 max-w-6xl">
            <section className="space-y-5">
              <div>
                <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                  CERTIFICATE MANAGEMENT
                </h2>
                <p className="font-sans text-xs text-slate-muted mt-1">
                  Add PDF or image certificates. New certificates appear in the public Certificates section.
                </p>
              </div>

              <form onSubmit={handleAddCertificate} className="card-dev rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Certificate title *</label>
                    <input
                      value={certificateDraft.title}
                      onChange={(e) => setCertificateDraft({ ...certificateDraft, title: e.target.value })}
                      required
                      maxLength={160}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Issuer</label>
                    <input
                      value={certificateDraft.issuer}
                      onChange={(e) => setCertificateDraft({ ...certificateDraft, issuer: e.target.value })}
                      maxLength={120}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Date</label>
                    <input
                      value={certificateDraft.date}
                      onChange={(e) => setCertificateDraft({ ...certificateDraft, date: e.target.value })}
                      placeholder="e.g. October 2026"
                      maxLength={80}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Credential URL</label>
                    <input
                      type="url"
                      value={certificateDraft.credentialUrl}
                      onChange={(e) => setCertificateDraft({ ...certificateDraft, credentialUrl: e.target.value })}
                      placeholder="Optional verification link"
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono-tech text-xs text-slate-muted block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={certificateDraft.description}
                    onChange={(e) => setCertificateDraft({ ...certificateDraft, description: e.target.value })}
                    maxLength={1000}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan resize-y"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    ref={certificateFileInput}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                    required
                    className="w-full text-xs text-slate-muted file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-midnight-elevated file:text-slate-main file:font-mono-tech"
                  />
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary shrink-0 px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {isSaving ? 'Uploading...' : 'Add Certificate'}
                  </button>
                </div>
                <p className="font-mono-tech text-[10px] text-slate-muted">PDF, JPG, PNG, or WebP · 4 MB maximum</p>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(portfolioData?.certificates || []).map((certificate, index) => {
                  const isImage = certificate.fileType?.startsWith('image/')
                    || /\.(jpe?g|png|webp)(?:$|\?)/i.test(certificate.fileUrl || '');
                  return (
                    <article key={certificate.id || index} className="card-dev rounded-2xl p-4 flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-midnight-elevated border border-midnight-border flex items-center justify-center">
                        {isImage && certificate.fileUrl
                          ? <img src={resolveAssetUrl(certificate.fileUrl)} alt={certificate.title} className="w-full h-full object-cover" />
                          : <FileText className="w-7 h-7 text-cyan" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-lg text-slate-main uppercase truncate">{certificate.title}</h3>
                        <p className="font-mono-tech text-[10px] text-slate-muted truncate">
                          {[certificate.issuer, certificate.date].filter(Boolean).join(' · ') || 'Certificate'}
                        </p>
                        {certificate.fileUrl && (
                          <a href={resolveAssetUrl(certificate.fileUrl)} target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[10px] text-cyan hover:underline">
                            Preview file
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMediaItem('certificates', certificate, 'Certificate')}
                        disabled={isSaving}
                        aria-label={`Delete ${certificate.title}`}
                        className="p-2 text-slate-muted hover:text-rose-400 border border-midnight-border rounded-xl disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="space-y-5 border-t border-midnight-border pt-8">
              <div>
                <h2 className="font-heading text-2xl text-slate-main tracking-wide uppercase">
                  PHOTO GALLERY MANAGEMENT
                </h2>
                <p className="font-sans text-xs text-slate-muted mt-1">
                  Upload JPG, PNG, or WebP photos. Gallery changes are published automatically.
                </p>
              </div>

              <form onSubmit={handleAddPhoto} className="card-dev rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Photo title *</label>
                    <input
                      value={photoDraft.title}
                      onChange={(e) => setPhotoDraft({ ...photoDraft, title: e.target.value })}
                      required
                      maxLength={160}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs text-slate-muted block mb-1">Category</label>
                    <input
                      value={photoDraft.category}
                      onChange={(e) => setPhotoDraft({ ...photoDraft, category: e.target.value })}
                      maxLength={80}
                      placeholder="e.g. Events, Projects"
                      className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono-tech text-xs text-slate-muted block mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={photoDraft.caption}
                    onChange={(e) => setPhotoDraft({ ...photoDraft, caption: e.target.value })}
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-elevated border border-midnight-border text-xs text-slate-main focus:outline-none focus:border-cyan resize-y"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_160px] gap-4 items-center">
                  <input
                    ref={photoFileInput}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      setPhotoFile(selectedFile);
                      setPhotoPreview(selectedFile ? URL.createObjectURL(selectedFile) : '');
                    }}
                    required
                    className="w-full text-xs text-slate-muted file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-midnight-elevated file:text-slate-main file:font-mono-tech"
                  />
                  {photoPreview && (
                    <img src={photoPreview} alt="Selected photo preview" className="w-full h-28 rounded-xl object-cover border border-midnight-border" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-mono-tech text-[10px] text-slate-muted">JPG, PNG, or WebP · 4 MB maximum</p>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary px-5 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {isSaving ? 'Uploading...' : 'Add Photo'}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(portfolioData?.gallery || [])
                  .filter((item) => (item.type || 'photo') === 'photo')
                  .map((photo, index) => (
                    <article key={photo.id || index} className="card-dev rounded-2xl overflow-hidden min-w-0">
                      <div className="aspect-[4/3] bg-midnight-elevated">
                        <img src={resolveAssetUrl(photo.url)} alt={photo.title || 'Portfolio photo'} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-lg text-slate-main uppercase truncate">{photo.title || 'Untitled photo'}</h3>
                          <p className="font-sans text-xs text-slate-muted line-clamp-2">{photo.caption}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteMediaItem('gallery', photo, 'Photo')}
                          disabled={isSaving}
                          aria-label={`Delete ${photo.title || 'photo'}`}
                          className="p-2 text-slate-muted hover:text-rose-400 border border-midnight-border rounded-xl disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
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

            {isLoadingMessages && messages.length === 0 ? (
              <div className="card-dev rounded-3xl p-12 text-center text-slate-muted font-mono-tech text-xs">
                Loading contact inquiries...
              </div>
            ) : messagesLoadError && messages.length === 0 ? (
              <div className="card-dev rounded-3xl p-12 text-center text-slate-muted font-mono-tech text-xs">
                Could not load inquiries. Use Refresh Messages to try again.
              </div>
            ) : messages.length === 0 ? (
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

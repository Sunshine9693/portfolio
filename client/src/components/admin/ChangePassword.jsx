import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function ChangePassword() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const submit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setFeedback(null);
    if (newPassword !== confirmation) {
      setFeedback({ success: false, message: 'The new passwords do not match.' });
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setFeedback({ success: false, message: 'Use a password no longer than 72 bytes.' });
      return;
    }
    setIsSaving(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      setFeedback(result);
      if (result.success) { setCurrentPassword(''); setNewPassword(''); setConfirmation(''); }
    } finally { setIsSaving(false); }
  };
  return <section className="mt-8 max-w-lg space-y-5">
    <h2 className="text-2xl font-semibold text-slate-main">Change password</h2>
    <p className="text-slate-muted">Choose a password of at least 12 characters. Changing it signs out your other sessions.</p>
    <form onSubmit={submit} className="card-dev rounded-xl p-6 space-y-5">
      {[
        { id: 'current-password', label: 'Current password', value: currentPassword, change: setCurrentPassword, autocomplete: 'current-password' },
        { id: 'new-password', label: 'New password', value: newPassword, change: setNewPassword, autocomplete: 'new-password' },
        { id: 'confirm-password', label: 'Confirm new password', value: confirmation, change: setConfirmation, autocomplete: 'new-password' },
      ].map((field) => <div key={field.id} className="space-y-1.5">
        <label htmlFor={field.id} className="text-sm font-medium text-slate-main">{field.label}</label>
        <input id={field.id} name={field.id} type="password" autoComplete={field.autocomplete} value={field.value} onChange={(event) => field.change(event.target.value)} required minLength={field.id === 'current-password' ? undefined : 12} maxLength={field.id === 'current-password' ? 200 : 72} disabled={isSaving} className="w-full px-3 py-2.5 rounded-lg bg-midnight-elevated border border-midnight-border text-slate-main focus:border-cyan focus:outline-none" />
      </div>)}
      {feedback && <p role={feedback.success ? 'status' : 'alert'} className={feedback.success ? 'text-emerald-700' : 'text-rose-700'}>{feedback.message}</p>}
      <button type="submit" disabled={isSaving} className="btn-primary w-full px-5 py-3 disabled:opacity-60">{isSaving ? 'Changing password…' : 'Change password'}</button>
    </form>
  </section>;
}

import { useId } from 'react';

// Use a visible native input so phone file providers and keyboard users share the same flow.
export function FilePicker({ label, imagesOnly = false, accept, onChange, disabled = false, inputRef, required = false }) {
  const id = useId();
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-slate-main">{label}</label>
    <input id={id} ref={inputRef} type="file" accept={accept || (imagesOnly ? 'image/*' : 'image/*,.pdf,application/pdf')}
      aria-label={label} disabled={disabled} required={required} onChange={onChange}
      className="block w-full min-w-0 max-w-full text-sm text-slate-main file:mr-3 file:px-4 file:py-3 file:rounded-xl file:border-0 file:bg-midnight-elevated file:text-slate-main cursor-pointer disabled:opacity-50" />
  </div>;
}

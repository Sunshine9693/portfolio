import { useState } from 'react';
import { FileText } from 'lucide-react';
import { FilePicker } from './FilePicker';
import { CertificateViewer } from '../gallery/CertificateViewer';

const fieldClass = 'w-full px-3 py-2 rounded-lg bg-midnight-elevated border border-midnight-border text-slate-main focus:outline-none focus:border-cyan';

export function InternshipEditor({ internships, onChange, isSaving, onUpload }) {
  const [preview, setPreview] = useState(null);
  const update = (index, changes) => onChange(internships.map((item, current) => current === index ? { ...item, ...changes } : item));
  const field = (item, index, key, label) => {
    const id = `internship-${item.id || index}-${key}`;
    return <div key={key} className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium text-slate-muted">{label}</label>
      <input id={id} className={fieldClass} value={item[key] || ''} onChange={event => update(index, { [key]: event.target.value })} />
    </div>;
  };

  return <div className="space-y-6">
    <p className="text-sm text-slate-muted">Upload a PDF or image for each internship, then choose Save Internships to publish it.</p>
    {internships.map((item, index) => <fieldset disabled={isSaving} key={item.id || index} className="card-dev min-w-0 rounded-xl p-5 sm:p-7 space-y-5">
      <h3 className="text-xl font-semibold text-slate-main">{item.company || 'New internship'}</h3>
      <div className="grid sm:grid-cols-2 gap-4">{field(item, index, 'company', 'Company')}{field(item, index, 'role', 'Role')}{field(item, index, 'period', 'Period')}{field(item, index, 'location', 'Location')}</div>
      <div className="space-y-2 border-t border-midnight-border pt-5">
        <FilePicker label={`Choose certificate for ${item.company || 'internship'}`} disabled={isSaving}
          onChange={event => onUpload(event, (certificateUrl, file) => update(index, { certificateUrl, certificateType: file.type, certificateName: file.name }))} />
        <p className="text-sm text-slate-muted">PDF, JPG, PNG or WebP. Uploading replaces the certificate in this draft; choose Save Internships to publish.</p>
        {item.certificateUrl && <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-main break-all">{item.certificateName || 'Certificate attached'}</span>
          <button type="button" onClick={() => setPreview(item)} className="btn-secondary px-3 py-2 inline-flex items-center gap-2 text-sm"><FileText size={16} />Preview certificate</button>
          <button type="button" onClick={() => update(index, { certificateUrl: '', certificateType: '', certificateName: '' })} className="px-3 py-2 text-sm text-rose-700">Remove from draft</button>
        </div>}
      </div>
    </fieldset>)}
    {preview && <CertificateViewer url={preview.certificateUrl} fileType={preview.certificateType} title={`${preview.company || 'Internship'} certificate`} onClose={() => setPreview(null)} />}
  </div>;
}

import { FileDown, Plus, Trash2 } from 'lucide-react';

const fieldClass = 'w-full px-3 py-2 rounded-lg bg-midnight-elevated border border-midnight-border text-slate-main focus:outline-none focus:border-cyan';

export function ProjectEditor({ projects, onChange, isSaving, onUpload }) {
  const update = (index, changes) => onChange(projects.map((project, current) => current === index ? { ...project, ...changes } : project));
  const addProject = () => onChange([...projects, {
    id: crypto.randomUUID(), title: 'New project', subtitle: '', type: 'Personal Project', status: 'Ongoing',
    description: '', longDescription: '', technologies: [], features: [], plannedFeatures: [], githubUrl: '', liveUrl: '', imageUrl: '', featured: false,
  }]);
  const textField = (project, index, key, label, multiline = false) => {
    const id = `project-${project.id || index}-${key}`;
    const props = { id, value: project[key] || '', onChange: (event) => update(index, { [key]: event.target.value }), className: fieldClass };
    return <div key={key} className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium text-slate-muted">{label}</label>
      {multiline ? <textarea {...props} rows={3} /> : <input {...props} type={key.endsWith('Url') ? 'url' : 'text'} />}
    </div>;
  };
  const listField = (project, index, key, label) => {
    const id = `project-${project.id || index}-${key}`;
    return <div className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium text-slate-muted">{label} <span className="font-normal">(one per line)</span></label>
      <textarea id={id} className={fieldClass} rows={3} value={(project[key] || []).join('\n')} onChange={(event) => update(index, { [key]: event.target.value.split('\n') })} />
    </div>;
  };

  return <div className="space-y-6">
    <p className="text-slate-muted">Add or edit projects below, then choose Save Projects to publish your changes.</p>
    <button type="button" onClick={addProject} disabled={isSaving} className="btn-secondary px-4 py-2 inline-flex items-center gap-2"><Plus size={16} /> Add project</button>
    {projects.map((project, index) => <article key={project.id || index} className="card-dev rounded-xl p-5 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-midnight-border pb-4">
        <h3 className="text-xl font-semibold text-slate-main">{project.title || 'Untitled project'}</h3>
        <button type="button" disabled={isSaving} aria-label={`Remove ${project.title || 'project'} from draft`} onClick={() => onChange(projects.filter((_, current) => current !== index))} className="text-sm text-rose-700 inline-flex items-center gap-2"><Trash2 size={16} /> Remove from draft</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {textField(project, index, 'title', 'Project title')}
        {textField(project, index, 'subtitle', 'Subtitle')}
        <div className="space-y-1.5"><label htmlFor={`type-${project.id}`} className="text-sm font-medium text-slate-muted">Project type</label><select id={`type-${project.id}`} value={project.type || 'Personal Project'} onChange={(event) => update(index, { type: event.target.value })} className={fieldClass}><option>Personal Project</option><option>College Group Project</option></select></div>
        <div className="space-y-1.5"><label htmlFor={`status-${project.id}`} className="text-sm font-medium text-slate-muted">Status</label><select id={`status-${project.id}`} value={project.status || 'Ongoing'} onChange={(event) => update(index, { status: event.target.value })} className={fieldClass}><option>Ongoing</option><option>Completed</option></select></div>
        {textField(project, index, 'githubUrl', 'GitHub URL')}
        {textField(project, index, 'liveUrl', 'Live demo URL')}
      </div>
      {textField(project, index, 'description', 'Short description', true)}
      {textField(project, index, 'longDescription', 'Project details', true)}
      <div className="grid sm:grid-cols-2 gap-4">{listField(project, index, 'technologies', 'Technologies')}{listField(project, index, 'features', 'Features')}</div>
      {listField(project, index, 'plannedFeatures', 'Planned additions')}
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        {textField(project, index, 'imageUrl', 'Image URL')}
        <label className="btn-secondary px-4 py-2 flex items-center justify-center gap-2 cursor-pointer"><FileDown size={16} /> Upload project image<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={isSaving} onChange={(event) => onUpload(event, (imageUrl) => update(index, { imageUrl }))} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-main"><input type="checkbox" checked={Boolean(project.featured)} onChange={(event) => onChange(projects.map((item, current) => ({ ...item, featured: current === index ? event.target.checked : false })))} /> Feature this project</label>
    </article>)}
  </div>;
}

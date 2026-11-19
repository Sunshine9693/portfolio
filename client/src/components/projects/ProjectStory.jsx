export function ProjectStory({ project }) {
  const entries = [
    ['Challenge', project.challenge],
    ['Result', project.result],
  ].filter(([, value]) => typeof value === 'string' && value.trim());
  if (!entries.length) return null;

  return <dl className="space-y-3 border-t border-midnight-border pt-4">
    {entries.map(([label, value]) => <div key={label}>
      <dt className="text-sm font-semibold text-slate-main">{label}</dt>
      <dd className="mt-1 text-sm text-slate-muted leading-relaxed">{value}</dd>
    </div>)}
  </dl>;
}

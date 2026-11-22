import { Link } from 'react-router-dom';

export function NotFound() {
  return <main className="min-h-screen bg-midnight text-slate-main flex items-center justify-center px-6">
    <div className="max-w-lg space-y-5">
      <p className="text-sm text-slate-muted">404 · Page not found</p>
      <h1 className="text-4xl font-heading">This page isn’t available.</h1>
      <p>The link may have changed. You can return to the portfolio or open the admin page.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn-primary px-5 py-3 rounded-xl">Back to portfolio</Link>
        <Link to="/admin" className="btn-secondary px-5 py-3 rounded-xl">Open admin</Link>
      </div>
    </div>
  </main>;
}

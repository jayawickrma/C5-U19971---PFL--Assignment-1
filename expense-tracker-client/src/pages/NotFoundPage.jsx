import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">We couldn't find that page.</p>
      <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}

import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 text-center">
      <h1 className="text-3xl font-semibold text-slate-800">404</h1>
      <p className="mt-2 text-sm text-slate-500">Page not found.</p>
      <Link to="/" className="btn-primary mt-4">
        Go home
      </Link>
    </div>
  );
}

export default NotFoundPage;
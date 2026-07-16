import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routePaths";

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 p-4">
      <div className="absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-primary-300/40 blur-3xl" />
      <div className="animation-delay-2000 absolute -bottom-24 -right-24 h-72 w-72 animate-blob rounded-full bg-primary-400/30 blur-3xl" />

      <div className="glass-card relative z-10 animate-fade-in-up p-10 text-center">
        <h1 className="text-4xl font-semibold text-primary-700">404</h1>
        <p className="mt-2 text-sm text-slate-500">
          This page doesn&apos;t exist or may have moved.
        </p>
        <Link to={ROUTES.LANDING} className="btn-primary mt-6 inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, ListChecks, CalendarDays, ArrowRight } from "lucide-react";
import { ROUTES } from "../constants/routePaths";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "See today's tasks, upcoming deadlines, and your overall progress at a glance.",
  },
  {
    icon: BookOpen,
    title: "Subjects",
    description: "Keep every course you're taking organized in one place, color-coded for clarity.",
  },
  {
    icon: ListChecks,
    title: "Tasks",
    description: "Track assignments with priorities, due dates, and status. Never miss a deadline.",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description: "Visualize every deadline on a simple month view, day by day.",
  },
];

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100">
      {/* Decorative background blobs — same treatment as AuthLayout */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-primary-300/40 blur-3xl" />
      <div className="animation-delay-2000 pointer-events-none absolute -right-24 top-1/3 h-72 w-72 animate-blob rounded-full bg-primary-400/30 blur-3xl" />
      <div className="animation-delay-4000 pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 animate-blob rounded-full bg-primary-200/40 blur-3xl" />

      <div className="relative z-10">
        {/* Top nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-lg font-semibold text-primary-700">StudyBoard</span>
          <div className="flex items-center gap-2">
            <Link to={ROUTES.LOGIN} className="btn-secondary">
              Log In
            </Link>
            <Link to={ROUTES.REGISTER} className="btn-primary">
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="mx-auto max-w-3xl px-6 pb-28 pt-16 text-center sm:pt-24">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-800 sm:text-5xl">
            Organize your academic life,
            <br className="hidden sm:block" /> all in one place.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-500 sm:text-lg">
            Manage subjects, track assignments, and stay ahead of every deadline.
            Built for students who want a clear, simple way to stay on top of their work.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={ROUTES.REGISTER} className="btn-primary gap-2 px-6 py-3 text-base">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={ROUTES.LOGIN} className="btn-secondary px-6 py-3 text-base">
              I already have an account
            </Link>
          </div>
        </main>

        {/* Feature highlights */}
        <section className="mx-auto max-w-5xl px-6 pt-8 pb-24">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                style={{
                  animation: `cardFloat 6s ease-in-out ${index * 0.4}s infinite`,
                }}
                className="group relative rounded-2xl border border-white/60 bg-white/30 p-6 text-left shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/80 hover:bg-white/50 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
              >
                {/* subtle inner glass highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/30 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="relative mt-4 text-sm font-semibold text-slate-800">{title}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-surface-200/60 py-8">
          <p className="text-center text-sm text-slate-400">
            StudyBoard - Student Time &amp; Task Management System
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="cardFloat"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
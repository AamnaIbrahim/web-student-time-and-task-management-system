import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navItems";
import { ROUTES } from "../../constants/routePaths";
import { useAuth } from "../../hooks/useAuth";
import { useSubjects } from "../../hooks/useSubjects";
import { useTasks } from "../../hooks/useTasks";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { getInitials } from "../../utils/stringHelpers";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { subjects } = useSubjects();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  useLockBodyScroll(isOpen);

  const hasSubjects = subjects.length > 0;
  const hasTasks = tasks.length > 0;

  function getDisabledReason(path) {
    if (path === ROUTES.TASKS && !hasSubjects) {
      return "Add your first subject to get started";
    }
    if (path === ROUTES.DASHBOARD) {
      if (!hasSubjects) return "Add your first subject to get started";
      if (!hasTasks) return "Add your first task to unlock the dashboard";
    }
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
        : "text-slate-500 hover:bg-surface-100 hover:text-slate-700"
    }`;

  const railLinkClasses = ({ isActive }) =>
    `flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
        : "text-slate-500 hover:bg-surface-100 hover:text-slate-700"
    }`;

  function renderFullNavItem(item, onNavigate) {
    const Icon = item.icon;
    const disabledReason = getDisabledReason(item.path);

    if (disabledReason) {
      return (
        <div key={item.path} className="group relative">
          <div className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300">
            <Icon className="h-5 w-5" />
            {item.label}
          </div>
          <div className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {disabledReason}
          </div>
        </div>
      );
    }

    return (
      <NavLink key={item.path} to={item.path} onClick={onNavigate} className={navLinkClasses}>
        <Icon className="h-5 w-5" />
        {item.label}
      </NavLink>
    );
  }

  function renderRailNavItem(item) {
    const Icon = item.icon;
    const disabledReason = getDisabledReason(item.path);

    if (disabledReason) {
      return (
        <div key={item.path} className="group relative">
          <div className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl text-slate-300">
            <Icon className="h-5 w-5" />
          </div>
          <div className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {disabledReason}
          </div>
        </div>
      );
    }

    return (
      <NavLink key={item.path} to={item.path} className={railLinkClasses} aria-label={item.label}>
        <Icon className="h-5 w-5" />
      </NavLink>
    );
  }

  const fullContent = (onNavigate = () => {}) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-base font-semibold text-primary-700">StudyBoard</span>
        <button
          onClick={onNavigate}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => renderFullNavItem(item, onNavigate))}
      </nav>

      <div className="border-t border-surface-200 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: always-visible full sidebar */}
      <aside className="relative z-[60] hidden w-64 shrink-0 border-r border-surface-200 bg-white lg:block">
        {fullContent()}
      </aside>

      {/* Below lg: slim icon-only rail, always visible */}
      <aside className="relative z-[60] flex w-16 shrink-0 flex-col items-center border-r border-surface-200 bg-white py-4 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-surface-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => renderRailNavItem(item))}
        </nav>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
          {getInitials(user?.name)}
        </div>
      </aside>

      {/* Expandable full drawer (mobile/tablet), triggered from the rail's hamburger */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {fullContent(() => setIsOpen(false))}
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
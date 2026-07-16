import { NavLink, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navItems";
import { ROUTES } from "../../constants/routePaths";
import { useAuth } from "../../hooks/useAuth";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useLockBodyScroll(isOpen);

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

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-base font-semibold text-primary-700">
          StudyBoard
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={navLinkClasses}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-surface-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="relative z-[60] hidden w-64 shrink-0 border-r border-surface-200 bg-white lg:block">
        {content}
      </aside>

      {/* Mobile/tablet drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
import { Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/stringHelpers";

function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-surface-200 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-1.5 text-slate-500 hover:bg-surface-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">
          {user?.name}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
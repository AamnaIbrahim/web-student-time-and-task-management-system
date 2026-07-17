import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <Sidebar />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        <div
          key={location.pathname}
          className="flex min-h-0 flex-1 flex-col animate-fade-in-up"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
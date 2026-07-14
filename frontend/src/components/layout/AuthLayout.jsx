import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-surface-50 to-primary-100 p-4">
      <div className="absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-primary-300/40 blur-3xl" />
      <div className="animation-delay-2000 absolute -bottom-24 -right-24 h-72 w-72 animate-blob rounded-full bg-primary-400/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
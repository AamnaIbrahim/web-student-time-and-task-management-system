import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routePaths";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const onSubmit = async (formData) => {
    setServerError("");
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to log in. Please try again.");
    }
  };

  return (
    <div className="glass-card animate-fade-in-up p-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Log in to continue managing your tasks
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="label-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input-field"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="input-field"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          Register
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] text-slate-400">
        Demo credentials: ahmad.raza@student.edu / password123
      </p>
    </div>
  );
}

export default LoginPage;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routePaths";
import SuccessDialog from "../../components/common/SuccessDialog";

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });

  const passwordValue = watch("password");

  const onSubmit = async ({ name, email, password }) => {
    setServerError("");
    try {
      await registerUser({ name, email, password });
      setShowSuccess(true);
    } catch (err) {
      setServerError(err.message || "Unable to register. Please try again.");
    }
  };

  const goToLogin = () => navigate(ROUTES.LOGIN, { replace: true });

  return (
    <div className="glass-card animate-fade-in-up p-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-slate-800">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Start organizing your academic life
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="label-text">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            className="input-field"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

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
            autoComplete="new-password"
            placeholder="••••••••"
            className="input-field"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) || "Password must include at least one uppercase letter",
                hasNumber: (value) =>
                  /[0-9]/.test(value) || "Password must include at least one number",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            At least 8 characters, with one uppercase letter and one number.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label-text">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="input-field"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === passwordValue || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          Log in
        </Link>
      </p>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={goToLogin}
        title="Account Created"
        message="Your account has been created successfully. Please log in to continue."
        actionLabel="Go to Login"
        onAction={goToLogin}
      />
    </div>
  );
}

export default RegisterPage;
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/stringHelpers";
import GlassBackdrop from "../components/common/GlassBackdrop";
import CharCount from "../components/common/CharCount";

const NAME_MAX_LENGTH = 50;

function ProfilePage() {
  const { user, updateProfile } = useAuth();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <GlassBackdrop />

      {/* Fixed header */}
      <div className="shrink-0 pb-4">
        <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account details and password.
        </p>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 pb-2">
          {/* Profile summary header */}
          <div className="glass-panel flex items-center gap-4 p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-semibold text-white shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-slate-800">{user?.name}</p>
              <p className="truncate text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <ProfileInfoForm user={user} updateProfile={updateProfile} />
          <ChangePasswordForm updateProfile={updateProfile} />
        </div>
      </div>
    </div>
  );
}

function ProfileInfoForm({ user, updateProfile }) {
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "" } });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  const nameValue = watch("name") || "";

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      await updateProfile(data);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-sm font-semibold text-slate-700">Profile Information</h2>
      <p className="mt-1 text-xs text-slate-400">Update your name and email address.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="label-text">
            Full Name
          </label>
          <input
            id="name"
            className="input-field"
            maxLength={NAME_MAX_LENGTH}
            {...register("name", {
              required: "Name is required",
              maxLength: { value: NAME_MAX_LENGTH, message: `Name must be under ${NAME_MAX_LENGTH} characters` },
            })}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            {errors.name ? <p className="text-xs text-red-500">{errors.name.message}</p> : <span />}
            <CharCount value={nameValue} max={NAME_MAX_LENGTH} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {status === "success" && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            Profile updated successfully.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errorMessage}</p>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ChangePasswordForm({ updateProfile }) {
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { newPassword: "", confirmPassword: "" } });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async ({ newPassword }) => {
    setStatus(null);
    try {
      await updateProfile({ password: newPassword });
      setStatus("success");
      reset();
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-sm font-semibold text-slate-700">Change Password</h2>
      <p className="mt-1 text-xs text-slate-400">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="newPassword" className="label-text">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) || "Password must include at least one uppercase letter",
                hasNumber: (value) =>
                  /[0-9]/.test(value) || "Password must include at least one number",
              },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            At least 8 characters, with one uppercase letter and one number.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label-text">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input-field"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) => value === newPasswordValue || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {status === "success" && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            Password updated successfully.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errorMessage}</p>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
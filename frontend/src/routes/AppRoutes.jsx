import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routePaths";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import OnboardingGate from "./OnboardingGate";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import SubjectsPage from "../pages/SubjectsPage";
import TasksPage from "../pages/TasksPage";
import CalendarPage from "../pages/CalendarPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LANDING} element={<LandingPage />} />

      {/* Logged-in users get redirected away from these back to Dashboard */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Everything below requires a logged-in user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<OnboardingGate />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.SUBJECTS} element={<SubjectsPage />} />
            <Route path={ROUTES.TASKS} element={<TasksPage />} />
            <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
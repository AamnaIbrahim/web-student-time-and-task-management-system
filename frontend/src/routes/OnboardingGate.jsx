import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSubjects } from "../hooks/useSubjects";
import { useTasks } from "../hooks/useTasks";
import { ROUTES } from "../constants/routePaths";
import LoadingState from "../components/common/LoadingState";

function OnboardingGate() {
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { tasks, loading: tasksLoading } = useTasks();
  const location = useLocation();

  if (subjectsLoading || tasksLoading) {
    return <LoadingState />;
  }

  const hasSubjects = subjects.length > 0;
  const hasTasks = tasks.length > 0;

  const needsSubjectFirst =
    !hasSubjects && (location.pathname === ROUTES.TASKS || location.pathname === ROUTES.DASHBOARD);

  if (needsSubjectFirst) {
    return <Navigate to={ROUTES.SUBJECTS} replace />;
  }

  if (hasSubjects && !hasTasks && location.pathname === ROUTES.DASHBOARD) {
    return <Navigate to={ROUTES.TASKS} replace />;
  }

  return <Outlet />;
}

export default OnboardingGate;
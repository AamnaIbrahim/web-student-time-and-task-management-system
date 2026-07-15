import { LayoutDashboard, BookOpen, ListChecks, CalendarDays, User } from "lucide-react";
import { ROUTES } from "./routePaths";

export const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Subjects", path: ROUTES.SUBJECTS, icon: BookOpen },
  { label: "Tasks", path: ROUTES.TASKS, icon: ListChecks },
  { label: "Calendar", path: ROUTES.CALENDAR, icon: CalendarDays },
  { label: "Profile", path: ROUTES.PROFILE, icon: User },
];
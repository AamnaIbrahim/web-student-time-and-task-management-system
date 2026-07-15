import { useMemo } from "react";
import { ListTodo, CalendarClock, ListChecks, CheckCircle2 } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useSubjects } from "../hooks/useSubjects";
import { isToday, isUpcomingWithin } from "../utils/dateHelpers";
import StatCard from "../components/dashboard/StatCard";
import TaskListCard from "../components/dashboard/TaskListCard";
import ProductivitySummary from "../components/dashboard/ProductivitySummary";

function DashboardPage() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { subjects, loading: subjectsLoading } = useSubjects();

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  const todaysTasks = useMemo(
    () => tasks.filter((t) => isToday(t.dueDate) && t.status === "Pending"),
    [tasks]
  );

  const upcomingDeadlines = useMemo(
    () => tasks.filter((t) => isUpcomingWithin(t.dueDate, 7) && t.status === "Pending"),
    [tasks]
  );

  const pendingTasks = useMemo(
    () => tasks.filter((t) => t.status === "Pending"),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Completed"),
    [tasks]
  );

  const isLoading = tasksLoading || subjectsLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Soft background blobs so the glass panels have visible depth
          behind them, without competing with the content itself. */}
      <div className="pointer-events-none absolute -left-10 -top-16 -z-10 h-64 w-64 animate-blob rounded-full bg-primary-200/40 blur-3xl" />
      <div className="animation-delay-2000 pointer-events-none absolute right-0 top-40 -z-10 h-56 w-56 animate-blob rounded-full bg-amber-200/30 blur-3xl" />
      <div className="animation-delay-4000 pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 animate-blob rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s an overview of your academic workload.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Today's Tasks" value={todaysTasks.length} icon={ListTodo} accent="primary" />
          <StatCard label="Upcoming Deadlines" value={upcomingDeadlines.length} icon={CalendarClock} accent="amber" />
          <StatCard label="Pending Tasks" value={pendingTasks.length} icon={ListChecks} accent="rose" />
          <StatCard label="Completed Tasks" value={completedTasks.length} icon={CheckCircle2} accent="emerald" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TaskListCard
            title="Today's Tasks"
            tasks={todaysTasks}
            subjectsById={subjectsById}
            emptyMessage="Nothing due today. Enjoy the breathing room."
          />
          <TaskListCard
            title="Upcoming Deadlines"
            tasks={upcomingDeadlines}
            subjectsById={subjectsById}
            emptyMessage="No deadlines in the next 7 days."
          />
        </div>

        <ProductivitySummary completed={completedTasks.length} total={tasks.length} />
      </div>
    </div>
  );
}

export default DashboardPage;
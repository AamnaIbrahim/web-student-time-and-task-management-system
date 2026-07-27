import { useMemo } from "react";
import { ListTodo, CalendarClock, ListChecks, CheckCircle2 } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useSubjects } from "../hooks/useSubjects";
import { isToday, isUpcomingWithin } from "../utils/dateHelpers";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import StatCard from "../components/dashboard/StatCard";
import TaskListCard from "../components/dashboard/TaskListCard";
import ProductivitySummary from "../components/dashboard/ProductivitySummary";

const LIST_MAX_HEIGHT = "max-h-[220px]";

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

  const upcomingThisWeek = useMemo(
    () => tasks.filter((t) => isUpcomingWithin(t.dueDate, 7) && t.status === "Pending"),
    [tasks]
  );
  const upcomingThisMonth = useMemo(
    () => tasks.filter((t) => isUpcomingWithin(t.dueDate, 30) && t.status === "Pending"),
    [tasks]
  );
  const upcomingDeadlines = upcomingThisWeek.length > 0 ? upcomingThisWeek : upcomingThisMonth;
  const upcomingRangeLabel = upcomingThisWeek.length > 0 ? "This Week" : "Next 30 days";

  const pendingTasks = useMemo(
    () => tasks.filter((t) => t.status === "Pending"),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Completed"),
    [tasks]
  );

  const isLoading = tasksLoading || subjectsLoading;

  if (isLoading) return <LoadingState />;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <GlassBackdrop />

      {/* Fixed header */}
      <div className="shrink-0 pb-4">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your academic workload.
        </p>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-6 pb-2">
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
              maxHeightClass={LIST_MAX_HEIGHT}
            />
            <TaskListCard
              title="Upcoming Deadlines"
              tasks={upcomingDeadlines}
              subjectsById={subjectsById}
              emptyMessage="No deadlines in the next 30 days."
              maxHeightClass={LIST_MAX_HEIGHT}
              rangeLabel={upcomingRangeLabel}
            />
          </div>

          <ProductivitySummary tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
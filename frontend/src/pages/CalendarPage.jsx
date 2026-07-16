import { useMemo, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useSubjects } from "../hooks/useSubjects";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import CalendarGrid from "../components/calendar/CalendarGrid";
import TaskListCard from "../components/dashboard/TaskListCard";
import { toDateKey } from "../utils/calendarHelpers";

function CalendarPage() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { subjects, loading: subjectsLoading } = useSubjects();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  // Group tasks by their due date so the grid can show a dot per day
  // without re-scanning the full task list on every render.
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const subject = subjectsById[task.subjectId];
      const entry = { ...task, subjectColor: subject?.color };
      if (!map[task.dueDate]) map[task.dueDate] = [];
      map[task.dueDate].push(entry);
    });
    return map;
  }, [tasks, subjectsById]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = toDateKey(selectedDate);
    return tasks.filter((t) => t.dueDate === key);
  }, [tasks, selectedDate]);

  const isLoading = tasksLoading || subjectsLoading;

  if (isLoading) return <LoadingState />;

  return (
    <div className="relative">
      <GlassBackdrop />

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Calendar</h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualize your task deadlines by date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <CalendarGrid
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            tasksByDate={tasksByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <TaskListCard
            title={
              selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })
                : "Select a date"
            }
            tasks={selectedDayTasks}
            subjectsById={subjectsById}
            emptyMessage="No tasks due on this date."
            maxHeightClass="max-h-[420px]"
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
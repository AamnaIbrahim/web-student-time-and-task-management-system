import { useMemo, useState } from "react";
import { isWithinCurrentWeek, isWithinCurrentMonth } from "../../utils/dateHelpers";

const RANGE_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

function ProductivitySummary({ tasks }) {
  const [range, setRange] = useState("week");

  const filteredTasks = useMemo(() => {
    if (range === "week") return tasks.filter((t) => isWithinCurrentWeek(t.dueDate));
    if (range === "month") return tasks.filter((t) => isWithinCurrentMonth(t.dueDate));
    return tasks;
  }, [tasks, range]);

  const completed = filteredTasks.filter((t) => t.status === "Completed").length;
  const total = filteredTasks.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Productivity Summary</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {total === 0
              ? "No tasks due in this period"
              : `${completed} of ${total} tasks completed`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl bg-surface-100 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  range === option.value
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="text-2xl font-semibold tracking-tight text-primary-600">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProductivitySummary;
import { CheckCircle2 } from "lucide-react";
import { formatDisplayDate, formatDisplayTime } from "../../utils/dateHelpers";

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
  Medium: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
};

function TaskListCard({ title, tasks, subjectsById, emptyMessage, maxHeightClass, rangeLabel }) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <div className="flex items-center gap-2">
          {rangeLabel && <span className="text-xs font-medium text-slate-400">{rangeLabel}</span>}
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
            {tasks.length}
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        <ul className={`space-y-2.5 ${maxHeightClass ? `${maxHeightClass} overflow-y-auto pr-1` : ""}`}>
          {tasks.map((task) => {
            const subject = subjectsById[task.subjectId];
            const isCompleted = task.status === "Completed";

            return (
              <li
                key={task.id}
                className={`flex items-start justify-between gap-3 rounded-xl border border-white/60 bg-white/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${
                  isCompleted ? "opacity-70" : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  {isCompleted && (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        isCompleted ? "text-slate-400 line-through" : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-0.5 break-words text-xs text-slate-400">
                      {subject?.name || "General"} · {formatDisplayDate(task.dueDate)}
                      {task.dueTime ? `, ${formatDisplayTime(task.dueTime)}` : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${PRIORITY_STYLES[task.priority] || "bg-surface-100 text-slate-500"}`}
                >
                  {task.priority}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TaskListCard;
import { Pencil, Trash2, Check } from "lucide-react";
import { formatDisplayDate, formatDisplayTime, isOverdue } from "../../utils/dateHelpers";

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
  Medium: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
};

function TaskCard({ task, subject, onEdit, onDelete, onToggleStatus }) {
  const isCompleted = task.status === "Completed";
  const overdue = !isCompleted && isOverdue(task.dueDate);

  return (
    <div className="glass-panel group relative overflow-hidden p-5 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleStatus(task)}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isCompleted
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-surface-200 hover:border-primary-400"
          }`}
        >
          {isCompleted && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                title={task.title}
                className={`truncate text-sm font-semibold ${
                  isCompleted ? "text-slate-400 line-through" : "text-slate-800"
                }`}
              >
                {task.title}
              </h3>
            </div>

            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                onClick={() => onEdit(task)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                aria-label={`Edit ${task.title}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 whitespace-pre-wrap break-words text-xs text-slate-400">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              title={subject?.name || "General"}
              className="max-w-[160px] truncate rounded-full px-2.5 py-1 text-[11px] font-medium text-white sm:max-w-[220px]"
              style={{ backgroundColor: subject?.color || "#94a3b8" }}
            >
              {subject?.name || "General"}
            </span>

            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${PRIORITY_STYLES[task.priority] || "bg-surface-100 text-slate-500"}`}>
              {task.priority}
            </span>

            <span className={`text-[11px] font-medium ${overdue ? "text-red-500" : "text-slate-400"}`}>
              {overdue ? "Overdue · " : ""}
              {formatDisplayDate(task.dueDate)}
              {task.dueTime ? `, ${formatDisplayTime(task.dueTime)}` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
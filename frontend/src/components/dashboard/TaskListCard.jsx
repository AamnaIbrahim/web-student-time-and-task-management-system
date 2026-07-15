import { formatDisplayDate, formatDisplayTime } from "../../utils/dateHelpers";

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
  Medium: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
};

function TaskListCard({ title, tasks, subjectsById, emptyMessage }) {
  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2.5">
          {tasks.map((task) => {
            const subject = subjectsById[task.subjectId];
            return (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {subject?.name || "General"} · {formatDisplayDate(task.dueDate)}
                    {task.dueTime ? `, ${formatDisplayTime(task.dueTime)}` : ""}
                  </p>
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
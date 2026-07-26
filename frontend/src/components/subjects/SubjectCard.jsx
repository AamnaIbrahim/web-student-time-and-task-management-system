import { Pencil, Trash2 } from "lucide-react";

function SubjectCard({ subject, onEdit, onDelete, onView }) {
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn(subject);
  };

  return (
    <div
      onClick={() => onView(subject)}
      className="glass-panel group relative cursor-pointer overflow-hidden p-5 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: subject.color }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-md"
          style={{ backgroundColor: subject.color }}
        >
          {subject.code?.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={stop(onEdit)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
            aria-label={`Edit ${subject.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={stop(onDelete)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${subject.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <h3 className="relative mt-3 truncate text-sm font-semibold text-slate-800">
        {subject.name}
      </h3>
      <p className="relative mt-1 truncate text-xs text-slate-400">
        {subject.code} · {subject.instructor}
      </p>
    </div>
  );
}

export default SubjectCard;
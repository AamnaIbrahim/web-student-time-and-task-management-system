function ProductivitySummary({ completed, total }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Productivity Summary</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {completed} of {total} tasks completed this term
          </p>
        </div>
        <span className="text-2xl font-semibold tracking-tight text-primary-600">
          {percentage}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-surface-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProductivitySummary;
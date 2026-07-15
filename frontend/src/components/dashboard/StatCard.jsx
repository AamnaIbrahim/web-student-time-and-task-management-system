const ACCENT_GRADIENTS = {
  primary: "from-primary-500 to-primary-700",
  amber: "from-amber-400 to-amber-600",
  emerald: "from-emerald-400 to-emerald-600",
  rose: "from-rose-400 to-rose-600",
};

function StatCard({ label, value, icon: Icon, accent = "primary" }) {
  return (
    <div className="glass-panel group relative overflow-hidden p-5 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${ACCENT_GRADIENTS[accent]} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ACCENT_GRADIENTS[accent]} shadow-md`}
        >
          <Icon className="h-5.5 w-5.5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-800">
            {value}
          </p>
          <p className="text-xs font-medium text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthMatrix, toDateKey, isSameDate } from "../../utils/calendarHelpers";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarGrid({ currentMonth, onMonthChange, tasksByDate, selectedDate, onSelectDate }) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = getMonthMatrix(year, month);
  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = new Date();

  const goToPrevMonth = () => onMonthChange(new Date(year, month - 1, 1));
  const goToNextMonth = () => onMonthChange(new Date(year, month + 1, 1));
  const goToToday = () => {
    onMonthChange(new Date());
    onSelectDate(new Date());
  };

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goToToday}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            Today
          </button>
          <button
            onClick={goToPrevMonth}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-surface-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-surface-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const key = toDateKey(cell.date);
          const dayTasks = tasksByDate[key] || [];
          const isToday = isSameDate(cell.date, today);
          const isSelected = selectedDate && isSameDate(cell.date, selectedDate);

          return (
            <button
              key={key}
              onClick={() => onSelectDate(cell.date)}
              className={`flex h-16 flex-col items-center justify-start gap-1 rounded-xl p-1.5 text-xs transition-all duration-150 ${
                !cell.currentMonth ? "text-slate-300" : "text-slate-600"
              } ${
                isSelected
                  ? "bg-primary-600 text-white"
                  : isToday
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "hover:bg-surface-100"
              }`}
            >
              <span>{cell.day}</span>
              {dayTasks.length > 0 && (
                <span className="flex gap-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? "#ffffff" : task.subjectColor || "#4672d1" }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
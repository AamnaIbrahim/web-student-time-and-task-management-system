export function toDateKey(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isSameDate(a, b) {
  return toDateKey(a) === toDateKey(b);
}

export function getMonthMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Leading days from the previous month
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({ day, currentMonth: false, date: new Date(year, month - 1, day) });
  }

  // Days in the current month
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, currentMonth: true, date: new Date(year, month, day) });
  }

  // Trailing days from the next month to complete a fixed 6-row grid
  let nextMonthDay = 1;
  while (cells.length < 42) {
    cells.push({
      day: nextMonthDay,
      currentMonth: false,
      date: new Date(year, month + 1, nextMonthDay),
    });
    nextMonthDay += 1;
  }

  return cells;
}
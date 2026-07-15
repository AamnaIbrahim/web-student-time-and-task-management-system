function toDateOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isToday(dueDate) {
  const today = toDateOnly(new Date());
  const target = toDateOnly(dueDate);
  return today.getTime() === target.getTime();
}

export function isUpcomingWithin(dueDate, days = 7) {
  const today = toDateOnly(new Date());
  const target = toDateOnly(dueDate);
  const diffMs = target.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= days;
}

export function isOverdue(dueDate) {
  const today = toDateOnly(new Date());
  const target = toDateOnly(dueDate);
  return target.getTime() < today.getTime();
}

export function formatDisplayDate(dueDate) {
  return new Date(dueDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDisplayTime(dueTime) {
  if (!dueTime) return "";
  const [hours, minutes] = dueTime.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
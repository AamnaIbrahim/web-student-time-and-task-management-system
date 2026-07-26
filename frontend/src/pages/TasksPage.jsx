import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useSubjects } from "../hooks/useSubjects";
import { isToday, isUpcomingWithin } from "../utils/dateHelpers";
import { ROUTES } from "../constants/routePaths";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SuccessDialog from "../components/common/SuccessDialog";
import TaskCard from "../components/tasks/TaskCard";
import TaskFormModal from "../components/tasks/TaskFormModal";

const STATUS_FILTERS = ["All", "Pending", "Completed"];
const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

function isWithinRange(dueDate, range) {
  if (range === "week") return isToday(dueDate) || isUpcomingWithin(dueDate, 7);
  if (range === "month") return isToday(dueDate) || isUpcomingWithin(dueDate, 30);
  return true;
}

function TasksPage() {
  const { tasks, loading: tasksLoading, addTask, editTask, removeTask, toggleTaskStatus } = useTasks();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFirstTaskDialog, setShowFirstTaskDialog] = useState(false);

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  const visibleTasks = useMemo(() => {
    let result = tasks;

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (subjectFilter !== "All") {
      result = result.filter((t) => t.subjectId === subjectFilter);
    }
    if (priorityFilter !== "All") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (rangeFilter !== "all") {
      result = result.filter((t) => isWithinRange(t.dueDate, rangeFilter));
    }

    const sorted = [...result];
    if (sortBy === "dueDate") {
      sorted.sort((a, b) => `${a.dueDate}T${a.dueTime || "00:00"}`.localeCompare(`${b.dueDate}T${b.dueTime || "00:00"}`));
    } else if (sortBy === "priority") {
      sorted.sort((a, b) => (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0));
    }

    return sorted;
  }, [tasks, statusFilter, subjectFilter, priorityFilter, rangeFilter, sortBy]);

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    const isFirstTask = !editingTask && tasks.length === 0;

    if (editingTask) {
      await editTask(editingTask.id, data);
    } else {
      await addTask(data);
    }

    if (isFirstTask) {
      setShowFirstTaskDialog(true);
    }
  };

  const handleToggleStatus = (task) => {
    toggleTaskStatus(task.id, task.status === "Completed" ? "Pending" : "Completed");
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await removeTask(deletingTask.id);
      setDeletingTask(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = tasksLoading || subjectsLoading;

  if (isLoading) return <LoadingState />;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <GlassBackdrop />

      {/* Fixed block — header, status tabs, and filters never scroll */}
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Tasks</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track assignments and deadlines across all your subjects.
            </p>
          </div>
          <button onClick={openCreateForm} className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        <div className="flex gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                statusFilter === filter
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="glass-panel flex flex-wrap items-center gap-3 p-3">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="input-field w-auto bg-white"
          >
            <option value="All">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field w-auto bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="input-field w-auto bg-white"
          >
            <option value="all">Any Time</option>
            <option value="week">Due This Week</option>
            <option value="month">Due This Month</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto bg-white"
            >
              <option value="dueDate">Nearest Due Date</option>
              <option value="priority">Priority (High First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visibleTasks.length === 0 ? (
          <div className="glass-panel p-10 text-center text-sm text-slate-400">
            No tasks match the selected filters.
          </div>
        ) : (
          <div className="space-y-3 pb-2">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                subject={subjectsById[task.subjectId]}
                onEdit={openEditForm}
                onDelete={setDeletingTask}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <SuccessDialog
        isOpen={showFirstTaskDialog}
        onClose={() => setShowFirstTaskDialog(false)}
        title="Task Added"
        message="Nice! Your dashboard is now ready with real data."
        actionLabel="Go to Dashboard"
        onAction={() => navigate(ROUTES.DASHBOARD)}
      />
    </div>
  );
}

export default TasksPage;
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useSubjects } from "../hooks/useSubjects";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TaskCard from "../components/tasks/TaskCard";
import TaskFormModal from "../components/tasks/TaskFormModal";

const FILTERS = ["All", "Pending", "Completed"];

function TasksPage() {
  const { tasks, loading: tasksLoading, addTask, editTask, removeTask, toggleTaskStatus } = useTasks();
  const { subjects, loading: subjectsLoading } = useSubjects();

  const [activeFilter, setActiveFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  const filteredTasks = useMemo(() => {
    if (activeFilter === "All") return tasks;
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
    } else {
      await addTask(data);
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
    <div className="relative">
      <GlassBackdrop />

      <div className="space-y-6">
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
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="glass-panel p-10 text-center text-sm text-slate-400">
            No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} tasks to show.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
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
    </div>
  );
}

export default TasksPage;
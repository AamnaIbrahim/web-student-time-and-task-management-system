import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";
import { ROUTES } from "../constants/routePaths";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SuccessDialog from "../components/common/SuccessDialog";
import SubjectCard from "../components/subjects/SubjectCard";
import SubjectFormModal from "../components/subjects/SubjectFormModal";

function SubjectsPage() {
  const { subjects, loading, addSubject, editSubject, removeSubject } = useSubjects();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFirstSubjectDialog, setShowFirstSubjectDialog] = useState(false);

  const openCreateForm = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const openEditForm = (subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    const isFirstSubject = !editingSubject && subjects.length === 0;

    if (editingSubject) {
      await editSubject(editingSubject.id, data);
    } else {
      await addSubject(data);
    }

    if (isFirstSubject) {
      setShowFirstSubjectDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await removeSubject(deletingSubject.id);
      setDeletingSubject(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <GlassBackdrop />

      {/* Fixed header */}
      <div className="flex shrink-0 items-center justify-between pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Subjects</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the courses you&apos;re taking this term.
          </p>
        </div>
        <button onClick={openCreateForm} className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {subjects.length === 0 ? (
          <div className="glass-panel p-10 text-center text-sm text-slate-400">
            No subjects yet. Add your first subject to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={openEditForm}
                onDelete={setDeletingSubject}
              />
            ))}
          </div>
        )}
      </div>

      <SubjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSubject}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingSubject)}
        onClose={() => setDeletingSubject(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deletingSubject?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      <SuccessDialog
        isOpen={showFirstSubjectDialog}
        onClose={() => setShowFirstSubjectDialog(false)}
        title="Subject Added"
        message="Great start! Now add your first task to begin tracking your work."
        actionLabel="Add a Task"
        onAction={() => navigate(ROUTES.TASKS)}
      />
    </div>
  );
}

export default SubjectsPage;
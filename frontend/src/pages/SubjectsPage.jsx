import { useState } from "react";
import { Plus } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";
import GlassBackdrop from "../components/common/GlassBackdrop";
import LoadingState from "../components/common/LoadingState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SubjectCard from "../components/subjects/SubjectCard";
import SubjectFormModal from "../components/subjects/SubjectFormModal";

function SubjectsPage() {
  const { subjects, loading, addSubject, editSubject, removeSubject } = useSubjects();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateForm = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const openEditForm = (subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingSubject) {
      await editSubject(editingSubject.id, data);
    } else {
      await addSubject(data);
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
    <div className="relative">
      <GlassBackdrop />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
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

        {subjects.length === 0 ? (
          <div className="glass-panel p-10 text-center text-sm text-slate-400">
            No subjects yet. Add your first subject to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}

export default SubjectsPage;
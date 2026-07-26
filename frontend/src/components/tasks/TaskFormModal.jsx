import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../common/Modal";
import { useSubjects } from "../../hooks/useSubjects";

const EMPTY_VALUES = {
  title: "",
  description: "",
  subjectId: "",
  priority: "Medium",
  dueDate: "",
  dueTime: "",
};

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { subjects } = useSubjects();
  const isEditMode = Boolean(initialData);
  const todayDateString = getTodayDateString();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { ...EMPTY_VALUES, subjectId: subjects[0]?.id || "" });
    }
  }, [isOpen, initialData, reset, subjects]);

  const submitHandler = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Task" : "Add Task"}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate className="space-y-4">
        <div>
          <label htmlFor="title" className="label-text">
            Title
          </label>
          <input
            id="title"
            className="input-field"
            placeholder="Assignment 3 - Binary Trees"
            maxLength={TITLE_MAX_LENGTH}
            {...register("title", {
              required: "Title is required",
              maxLength: { value: TITLE_MAX_LENGTH, message: `Title must be under ${TITLE_MAX_LENGTH} characters` },
            })}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label-text">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={DESCRIPTION_MAX_LENGTH}
            className="input-field resize-none"
            placeholder="Optional details about the task"
            {...register("description", {
              maxLength: {
                value: DESCRIPTION_MAX_LENGTH,
                message: `Description must be under ${DESCRIPTION_MAX_LENGTH} characters`,
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subjectId" className="label-text">
            Subject
          </label>
          <select
            id="subjectId"
            className="input-field"
            {...register("subjectId", { required: "Subject is required" })}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <p className="mt-1 text-xs text-red-500">{errors.subjectId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="label-text">
            Priority
          </label>
          <select id="priority" className="input-field" {...register("priority")}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="dueDate" className="label-text">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              min={todayDateString}
              className="input-field"
              {...register("dueDate", {
                required: "Due date is required",
                validate: (value) =>
                  value >= todayDateString || "Due date cannot be in the past",
              })}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="dueTime" className="label-text">
              Due Time
            </label>
            <input id="dueTime" type="time" className="input-field" {...register("dueTime")} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
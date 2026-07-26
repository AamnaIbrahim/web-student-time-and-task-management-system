import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";
import Modal from "../common/Modal";
import CharCount from "../common/CharCount";
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

function SubjectPicker({ subjects, value, onChange, hasError }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = subjects.find((s) => s.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`input-field flex items-center justify-between gap-2 text-left ${
          hasError ? "border-red-300" : ""
        }`}
      >
        <span className={`truncate ${selected ? "text-slate-800" : "text-slate-400"}`}>
          {selected ? selected.name : "Select a subject"}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Click-outside overlay to close the dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-surface-200 bg-white p-1 shadow-lg">
            {subjects.map((subject) => (
              <button
                type="button"
                key={subject.id}
                onClick={() => {
                  onChange(subject.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-snug transition-colors hover:bg-surface-100 ${
                  subject.id === value ? "bg-primary-50 text-primary-700" : "text-slate-700"
                }`}
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="min-w-0 flex-1 whitespace-normal break-words">
                  {subject.name}
                </span>
                {subject.id === value && (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { subjects } = useSubjects();
  const isEditMode = Boolean(initialData);
  const todayDateString = getTodayDateString();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { ...EMPTY_VALUES, subjectId: subjects[0]?.id || "" });
    }
  }, [isOpen, initialData, reset, subjects]);

  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";

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
          <div className="mt-1 flex items-center justify-between gap-2">
            {errors.title ? <p className="text-xs text-red-500">{errors.title.message}</p> : <span />}
            <CharCount value={titleValue} max={TITLE_MAX_LENGTH} />
          </div>
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
          <div className="mt-1 flex items-center justify-between gap-2">
            {errors.description ? (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            ) : (
              <span />
            )}
            <CharCount value={descriptionValue} max={DESCRIPTION_MAX_LENGTH} />
          </div>
        </div>

        <div>
          <label className="label-text">Subject</label>
          <Controller
            name="subjectId"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <SubjectPicker
                subjects={subjects}
                value={field.value}
                onChange={field.onChange}
                hasError={Boolean(errors.subjectId)}
              />
            )}
          />
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../common/Modal";

const COLOR_OPTIONS = [
  "#4672d1",
  "#3557b3",
  "#6b94de",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
];

const EMPTY_VALUES = { name: "", code: "", instructor: "", color: COLOR_OPTIONS[0] };

function SubjectFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || EMPTY_VALUES);
    }
  }, [isOpen, initialData, reset]);

  const selectedColor = watch("color");

  const submitHandler = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Subject" : "Add Subject"}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="label-text">
            Subject Name
          </label>
          <input
            id="name"
            className="input-field"
            placeholder="Data Structures & Algorithms"
            {...register("name", { required: "Subject name is required" })}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="code" className="label-text">
              Course Code
            </label>
            <input
              id="code"
              className="input-field"
              placeholder="CS-201"
              {...register("code", { required: "Code is required" })}
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
          </div>
          <div>
            <label htmlFor="instructor" className="label-text">
              Instructor
            </label>
            <input
              id="instructor"
              className="input-field"
              placeholder="Dr. Sarah Khan"
              {...register("instructor", { required: "Instructor is required" })}
            />
            {errors.instructor && (
              <p className="mt-1 text-xs text-red-500">{errors.instructor.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label-text">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setValue("color", color)}
                className={`h-7 w-7 rounded-full transition-transform duration-150 ${
                  selectedColor === color
                    ? "scale-110 ring-2 ring-primary-400 ring-offset-2"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Subject"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SubjectFormModal;
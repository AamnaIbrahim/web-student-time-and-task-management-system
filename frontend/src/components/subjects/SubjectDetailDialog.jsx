import Modal from "../common/Modal";

function SubjectDetailDialog({ subject, onClose }) {
  return (
    <Modal isOpen={Boolean(subject)} onClose={onClose} title="Subject Details">
      {subject && (
        <div className="space-y-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-white shadow-md"
            style={{ backgroundColor: subject.color }}
          >
            {subject.code?.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <p className="label-text mb-1">Subject Name</p>
            <p className="break-words text-sm font-medium text-slate-800">{subject.name}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="label-text mb-1">Course Code</p>
              <p className="break-words text-sm text-slate-700">{subject.code}</p>
            </div>
            <div>
              <p className="label-text mb-1">Instructor</p>
              <p className="break-words text-sm text-slate-700">{subject.instructor}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default SubjectDetailDialog;
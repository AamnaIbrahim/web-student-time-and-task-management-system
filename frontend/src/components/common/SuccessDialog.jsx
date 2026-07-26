import { CheckCircle2 } from "lucide-react";
import Modal from "./Modal";

function SuccessDialog({ isOpen, onClose, title, message, actionLabel, onAction }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center pt-1 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="mt-3 text-sm text-slate-500">{message}</p>
        <button onClick={onAction} className="btn-primary mt-5 w-full">
          {actionLabel}
        </button>
      </div>
    </Modal>
  );
}

export default SuccessDialog;
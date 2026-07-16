import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

function Modal({ isOpen, onClose, title, children }) {
  const [show, setShow] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-white/20 backdrop-blur-lg transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl transition-all duration-300 ${
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-surface-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
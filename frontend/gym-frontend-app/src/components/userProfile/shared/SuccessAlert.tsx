import React from "react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--color-green-50)] border border-[var(--color-primary-green)] rounded-md px-4 py-3 shadow-md w-[480px] flex items-start gap-3 animate-fadeIn">
      <IoCheckmarkCircle size={20} className="text-[var(--color-primary-green)] mt-0.5" />
      <div className="flex-1 text-sm text-[var(--color-neutral-900)]">
        <p className="font-semibold">Success</p>
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="text-[var(--color-neutral-900)] hover:text-black ml-2">
        <IoClose size={18} />
      </button>
    </div>
  );
};

export default SuccessAlert;

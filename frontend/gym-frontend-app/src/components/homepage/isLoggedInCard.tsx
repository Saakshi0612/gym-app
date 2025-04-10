import React from "react";
import Button from "../common/button";

interface LoginPromptModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onLogin: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onCancel,
  onLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal heading */}
        <h2 className="text-xl font-semibold mb-4">Log in to book workout</h2>

        {/* Modal description */}
        <p className="text-gray-600 mb-6 text-sm">
          You must be logged in to book a workout. Please log in to access
          available slots and book your session.
        </p>

        {/* Modal actions */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onLogin}
            variant="primary"
            className="px-4 py-2 text-sm"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;

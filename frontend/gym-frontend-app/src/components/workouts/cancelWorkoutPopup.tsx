import { X } from "lucide-react";
import Button from "../common/ButtonComponent";

interface CancelWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export default function CancelWorkoutModal({
  isOpen,
  onClose,
  onCancel,
}: CancelWorkoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-primary-black">
          Cancel Workout
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-6 text-justify">
          You’re about to mark this workout as canceled. Are you sure you want
          to cancel this session? Any progress or data from this workout will
          not be saved.
        </p>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={onClose}
          >
            Resume Workout
          </Button>
          <Button
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={onCancel}
          >
            Cancel Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

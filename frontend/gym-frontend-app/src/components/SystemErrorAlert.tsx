// src/components/SystemErrorAlert.tsx
import { FaTimes } from 'react-icons/fa';

interface SystemErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export default function SystemErrorAlert({ message, onDismiss }: SystemErrorAlertProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 relative shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <FaTimes className="text-white text-xs" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">
              {message}
            </div>
          </div>
          <button 
            type="button" 
            className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
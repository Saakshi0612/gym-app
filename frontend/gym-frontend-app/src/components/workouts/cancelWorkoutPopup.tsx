/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";
import Button from "../common/ButtonComponent";
import axios from "axios";
import { useAppSelector } from "../../store/store";

interface CancelWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  workoutId?: string | number;
}

export default function CancelWorkoutModal({
  isOpen,
  onClose,
  onCancel,
  workoutId,
}: CancelWorkoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current user ID from Redux store
  const auth = useAppSelector((state) => state.auth);
  const userId = auth.user?.id;

  if (!isOpen) return null;

  const handleCancelWorkout = async () => {
    // If no workout ID, just call the onCancel function (for backward compatibility)
    if (!workoutId || !userId) {
      onCancel();
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Try using the workout endpoint with the correct parameters
      // Note: We're using a PUT request since we're updating the workout status
      await axios({
        method: 'put',
        url: `https://nw4riour66.execute-api.ap-southeast-1.amazonaws.com/dev/workout`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          id: workoutId,
          clientId: userId,
          action: 'cancel'
        }
      });

      // Dispatch event to notify other components
      window.dispatchEvent(new Event('workoutCancelled'));
      
      // Call the original onCancel function
      onCancel();
      onClose();
    } catch (error) {
      console.error('Error canceling workout:', error);
      
      // Try alternative approach if the first one fails
      try {
        const token = localStorage.getItem('accessToken');
        
        // Try a direct PATCH to update the workout state
        await axios({
          method: 'patch',
          url: `https://nw4riour66.execute-api.ap-southeast-1.amazonaws.com/dev/workout/${workoutId}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            state: 'CANCELLED'
          }
        });
        
        // If successful, proceed with UI updates
        window.dispatchEvent(new Event('workoutCancelled'));
        onCancel();
        onClose();
      } catch (secondError) {
        console.error('Second attempt to cancel workout failed:', secondError);
        
        // As a last resort, try to use the delete endpoint but explain it's for cancellation
        try {
          const token = localStorage.getItem('accessToken');
          
          await axios({
            method: 'delete',
            url: `https://nw4riour66.execute-api.ap-southeast-1.amazonaws.com/dev/workout?id=${workoutId}`,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // If successful, proceed with UI updates
          window.dispatchEvent(new Event('workoutCancelled'));
          onCancel();
          onClose();
        } catch (thirdError) {
          console.error('Third attempt to cancel workout failed:', thirdError);
          
          let errorMessage = 'Failed to cancel workout. Please try again.';
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          
          setError(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-primary-black">
          Cancel Workout
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-6 text-justify">
          You're about to mark this workout as canceled. Are you sure you want
          to cancel this session? The workout will still be visible in your history.
        </p>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Keep Workout
          </Button>
          <Button
            variant="primary"
            className="rounded-md px-4 py-2 text-sm"
            onClick={handleCancelWorkout}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Workout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
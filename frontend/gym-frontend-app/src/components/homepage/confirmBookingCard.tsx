/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Dumbbell, X } from 'lucide-react';
import Button from '../common/ButtonComponent';
import { useAppSelector, useAppDispatch } from '../../store/store';
import SystemAlert from '../SystemAlert';
import { bookWorkout, resetBookingState } from '../../services/bookingSlice';

interface ConfirmBookingCardProps {
  coach: any;
  onClose: () => void;
}

const ConfirmBookingCard: React.FC<ConfirmBookingCardProps> = ({
  coach,
  onClose,
}) => {
  const { firstName, lastName, title, rating, specializations } =
    coach.Coaches || {};
  const { selectedTime, selectedDate, availableSlots = [] } = coach || {};

  const auth = useAppSelector((state) => state.auth);
  const booking = useAppSelector((state) => state.booking);
  const userId = auth.user?.id;
  const dispatch = useAppDispatch();

  const [selectedTimeHere, setSelectedTimeHere] = useState('');
  const [timeSlotId, setTimeSlotId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Clean up booking state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch]);

  // Handle booking state changes
  useEffect(() => {
    if (booking.success) {
      setAlertType('success');
      setAlertMessage('Your workout has been successfully booked!');
      setShowAlert(true);
      window.dispatchEvent(new Event('workoutBooked'));
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    
    if (booking.error) {
      setAlertType('error');
      setAlertMessage(booking.error);
      setShowAlert(true);
    }
  }, [booking.success, booking.error, onClose]);

  // Resolve selectedTimeHere and timeSlotId
  useEffect(() => {
    if (!selectedTime) return;

    let label = '';
    let slotId = null;

    if (selectedTime.label) {
      label = selectedTime.label;
      slotId = selectedTime._id || selectedTime.id;
    } else if (selectedTime.time) {
      label = selectedTime.time;
      slotId = selectedTime._id || selectedTime.id;
    } else if (typeof selectedTime === 'string') {
      label = selectedTime;
    } else if (selectedTime.time_slot) {
      label = selectedTime.time_slot;
      slotId = selectedTime._id || selectedTime.id;
    }

    // Try to find the ID if missing
    if (!slotId && availableSlots.length > 0 && label) {
      const match = availableSlots.find(
        (slot) => slot.time === label || slot.label === label || slot.time_slot === label
      );
      if (match) {
        slotId = match._id || match.id;
      }
    }

    setSelectedTimeHere(label);
    setTimeSlotId(slotId);
  }, [selectedTime, availableSlots]);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
      });

  const handleConfirm = () => {
    const coachId = coach?.Coaches?._id || coach?.Coaches?.id || coach?._id || coach?.id;
    if (!coachId) {
      setAlertType('error');
      setAlertMessage('Coach ID is missing.');
      setShowAlert(true);
      return;
    }

    const date = new Date(selectedDate || new Date()).toLocaleDateString();
    
    if (!timeSlotId && !selectedTimeHere) {
      setAlertType('error');
      setAlertMessage('Time slot information is missing.');
      setShowAlert(true);
      return;
    }

    if (!userId) {
      setAlertType('error');
      setAlertMessage('User ID is missing.');
      setShowAlert(true);
      return;
    }

    const bookingData = {
      activity: specializations?.[0] || 'General Fitness',
      coach: coachId,
      client: userId,
      date: date,
      slot: timeSlotId || { time: selectedTimeHere },
    };

    dispatch(bookWorkout(bookingData));
  };

  return (
    <div className="fixed inset-0 z-90 flex text-gray-800 items-center justify-center px-5 bg-black/30">
      {showAlert && (
        <SystemAlert
          type={alertType}
          message={alertMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg relative px-6 py-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-neutral-900 mb-1">
          Confirm your booking
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please double-check your workout details.
        </p>

        {booking.error && !showAlert && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {booking.error}
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border">
              <img
                src={coach?.profileImageUrl}
                alt={`${firstName || 'Coach'} ${lastName || ''}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-profile.png';
                }}
              />
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {firstName || 'Coach'} {lastName || ''}
              </p>
              <p className="text-sm text-gray-500">
                {title || 'Fitness Coach'}
              </p>
              <p className="text-sm font-medium text-gray-800 flex items-center">
                {rating || '5.0'}{' '}
                <span className="text-yellow-400 ml-1">★</span>
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Type:</strong>{' '}
                {specializations?.[0] || 'General Fitness'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Time:</strong> {selectedTime.time_slot || selectedTimeHere}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Date:</strong> {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          variant="primary"
          className="w-full bg-lime-400 text-black font-semibold py-3 rounded-lg hover:bg-lime-500 transition"
          disabled={booking.loading}
        >
          {booking.loading ? 'Booking...' : 'Confirm'}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBookingCard;
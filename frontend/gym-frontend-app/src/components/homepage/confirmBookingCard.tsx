import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Dumbbell, X } from 'lucide-react';
import Button from '../common/ButtonComponent';
import { useAppSelector } from '../../store/store';
import axios from 'axios';
import SystemAlert from '../SystemAlert'; // Import the SystemAlert component

interface ConfirmBookingCardProps {
	coach: any;
	onClose: () => void;
}

const ConfirmBookingCard: React.FC<ConfirmBookingCardProps> = ({
	coach,
	onClose,
}) => {
	// Add detailed logging to see the exact structure of the coach object
	useEffect(() => {
		console.log('Coach object in ConfirmBookingCard:', coach);
		console.log('Coach ID:', coach?._id);
		console.log('Coach ID type:', typeof coach?._id);
		console.log('Selected time full object:', coach?.selectedTime);
		console.log('Selected date:', coach?.selectedDate);
		
		// Log available slots if present
		if (coach?.availableSlots) {
			console.log('Available slots:', coach.availableSlots);
		}
	}, [coach]);

	const {
		firstName,
		lastName,
		title,
		rating,
		specializations,
		availableSlots,
		selectedTime,
		selectedDate,
	} = coach || {};

	const auth = useAppSelector((state) => state.auth);
	const userId = auth.user?.id;

	// Log the user ID for debugging
	useEffect(() => {
		console.log('User ID in ConfirmBookingCard:', userId);
	}, [userId]);

	// Get the display time from selectedTime
	let selectedTimeHere;
	let timeSlotId;
	
	if (selectedTime) {
		console.log('Selected time object structure:', selectedTime);
		
		// Try to extract the display time
		if (selectedTime.label) {
			selectedTimeHere = selectedTime.label;
		} else if (selectedTime.time) {
			selectedTimeHere = selectedTime.time;
		} else if (typeof selectedTime === 'string') {
			selectedTimeHere = selectedTime;
		}
		
		// Try to extract the time slot ID
		timeSlotId = selectedTime._id || selectedTime.id;
		
		// If no ID found but we have availableSlots, try to find the matching slot
		if (!timeSlotId && availableSlots && selectedTimeHere) {
			console.log('Looking for time slot ID in available slots');
			const matchingSlot = availableSlots.find(slot => 
				(slot.time === selectedTimeHere || slot.label === selectedTimeHere)
			);
			
			if (matchingSlot) {
				console.log('Found matching slot:', matchingSlot);
				timeSlotId = matchingSlot._id || matchingSlot.id;
			}
		}
		
		console.log('Extracted time slot ID:', timeSlotId);
		console.log('Extracted display time:', selectedTimeHere);
	}

	const formattedDate = selectedDate
		? new Date(selectedDate).toLocaleDateString('en-IN', {
				month: 'long',
				day: 'numeric',
			})
		: new Date().toLocaleDateString('en-IN', {
				month: 'long',
				day: 'numeric',
			});

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	
	// Add state for the SystemAlert
	const [showAlert, setShowAlert] = useState(false);
	const [alertType, setAlertType] = useState<'success' | 'error'>('success');
	const [alertMessage, setAlertMessage] = useState('');

	const handleConfirm = async () => {
		try {
			console.log('Starting booking confirmation process');
			setIsLoading(true);
			setErrorMessage(null);
			
			// Get the coach ID - try multiple possible locations
			const coachId = coach?._id || coach?.id;
			
			if (!coachId) {
				console.error('Coach object:', coach);
				throw new Error('Coach ID is missing. Please try again or select a different coach.');
			}
			
			// Parse input date
			const inputDate = new Date(selectedDate ? selectedDate : new Date());
			
			// Convert to ISO string format
			const isoString = inputDate.toISOString();
			
			// Get auth token
			const token = localStorage.getItem('accessToken');
			
			if (!token) {
				throw new Error('Authentication token not found. Please log in again.');
			}

			// Check if we have a time slot ID
			if (!timeSlotId) {
				console.error('Selected time data:', selectedTime);
				console.error('Available slots:', availableSlots);
				
				// If we have a time string but no ID, create a mock slot ID
				// This is a fallback solution if your backend can accept just the time
				if (selectedTimeHere) {
					console.log('Creating a mock slot with the selected time');
					timeSlotId = {
						time: selectedTimeHere
					};
				} else {
					throw new Error('Time slot information is missing. Please select a time slot.');
				}
			}

			// Check if user ID exists
			if (!userId) {
				console.error('Auth user data:', auth.user);
				throw new Error('User ID is missing. Please log in again.');
			}

			// Log all the required fields to verify they exist
			console.log('Coach ID:', coachId);
			console.log('User ID:', userId);
			console.log('Time Slot ID or object:', timeSlotId);
			console.log('Activity:', coach.specializations?.[0] || 'General Fitness');

			// Prepare the data for the API request
			const bookingData = {
				activity: coach.specializations?.[0] || 'General Fitness',
				coach: coachId,
				client: userId,
				date: isoString,
				slot: timeSlotId,
			};

			console.log('Booking data prepared:', bookingData);
			console.log('JSON stringified booking data:', JSON.stringify(bookingData));

			// Make the API request
			console.log('Sending POST request to API');
			const response = await axios({
				method: 'post',
				url: 'https://p3kuc80q67.execute-api.ap-southeast-1.amazonaws.com/dev/workout',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				data: bookingData
			});

			console.log('API response received:', response);
			console.log('Booking confirmed successfully');

			// Show success message with SystemAlert instead of alert()
			setAlertType('success');
			setAlertMessage('Your workout has been successfully booked!');
			setShowAlert(true);
			
			// Dispatch event to refresh workouts list
			window.dispatchEvent(new Event('workoutBooked'));
			
			// Close the modal after a short delay to allow the user to see the success message
			setTimeout(() => {
				onClose();
			}, 2000);
		} catch (error) {
			console.error('Error confirming booking (full error):', error);
			
			let displayMessage = 'Failed to book workout. Please try again.';
			
			if (error.response?.data?.message) {
				displayMessage = `Booking failed: ${error.response.data.message}`;
			} else if (error instanceof Error) {
				displayMessage = error.message;
			}
			
			setErrorMessage(displayMessage);
			
			// Show error message with SystemAlert instead of alert()
			setAlertType('error');
			setAlertMessage(displayMessage);
			setShowAlert(true);
		} finally {
			setIsLoading(false);
			console.log('Booking process completed (success or failure)');
		}
	};

	return (
		<div className="fixed inset-0 z-90 flex text-gray-800 items-center justify-center px-5 bg-black/30">
			{/* SystemAlert component */}
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

				{errorMessage && !showAlert && (
					<div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
						{errorMessage}
					</div>
				)}

				<div className="flex items-start justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full overflow-hidden border">
							<img
								src={coach?.profileImageUrl || 'https://via.placeholder.com/150'}
								alt={`${firstName || 'Coach'} ${lastName || ''}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									console.log('Image load error, using fallback');
									e.currentTarget.src = 'https://via.placeholder.com/150';
								}}
							/>
						</div>
						<div>
							<p className="font-semibold text-lg text-gray-900">
								{firstName || 'Coach'} {lastName || ''}
							</p>
							<p className="text-sm text-gray-500">{title || 'Fitness Coach'}</p>
							<p className="text-sm font-medium text-gray-800 flex items-center">
								{rating || '5.0'} <span className="text-yellow-400 ml-1">★</span>
							</p>
						</div>
					</div>

					<div className="text-sm text-gray-700 space-y-2">
						<div className="flex items-center gap-2">
							<Dumbbell className="w-4 h-4 text-gray-500" />
							<span>
								<strong>Type:</strong> {specializations?.[0] || 'General Fitness'}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-gray-500" />
							<span>
								<strong>Time:</strong> {selectedTimeHere 
									? (typeof selectedTimeHere === 'string' && selectedTimeHere.includes('-') 
										? selectedTimeHere.split('-')[0].trim() 
										: selectedTimeHere) 
									: 'N/A'}
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
					disabled={isLoading}
				>
					{isLoading ? 'Booking...' : 'Confirm'}
				</Button>
			</div>
		</div>
	);
};

export default ConfirmBookingCard;

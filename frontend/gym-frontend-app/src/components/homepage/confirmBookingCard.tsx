import React from 'react';
import { useState } from 'react';
import { Calendar, Clock, Dumbbell, X } from 'lucide-react';
import Button from '../common/ButtonComponent';
import { useAppSelector } from '../../store/store';
import axios, { AxiosError } from 'axios';

interface ConfirmBookingCardProps {
	coach: any;
	onClose: () => void;
}

const ConfirmBookingCard: React.FC<ConfirmBookingCardProps> = ({
	coach,
	onClose,
}) => {
	const {
		firstName,
		lastName,
		title,
		rating,
		specializations,
		availableSlots,
		selectedTime,
		selectedDate,
	} = coach;

	const auth = useAppSelector((state) => state.auth);
	console.log('card', selectedTime);
	let selectedTimeHere;
	if (selectedTime) {
		if (selectedTime.label) {
			selectedTimeHere = selectedTime.label;
		} else if (selectedTime.time) {
			selectedTimeHere = selectedTime.time;
		}
	}

	const formattedDate = selectedDate
		? new Date(selectedDate).toLocaleDateString('en-IN', {
				month: 'long', // Full month name
				day: 'numeric', // Day of the month
			})
		: new Date().toLocaleDateString('en-IN', {
				month: 'long', // Full month name
				day: 'numeric', // Day of the month
			});

	// const selectedTime = availableSlots?.[0]?.time || 'N/A';
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		try {
			// Show loading state (optional)
			setIsLoading(true); // You would need to add this state to your component

			// Prepare the data for the API request based on your backend requirements
			const bookingData = {
				activity: coach.specializations[0] || 'General Fitness', // Using the first specialization as the activity
				coach: coach._id, // Assuming coach has an id field
				client: auth.user.id, // Assuming you store user ID in localStorage
				date: selectedDate ? selectedDate : new Date(), // From the component props
				slot: selectedTime._id, // From the component props
			};

			console.log('Sending booking request:', bookingData);

			// Make the API request to your backend endpoint
			const { data } = await axios.post('/workout', {
				// Your POST endpoint
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify(bookingData),
			});

			console.log('Booking confirmed:', data);

			// Show success message
			alert('Your workout has been successfully booked!');
			// Or use a toast notification library if you have one

			// Close the modal
			onClose();
		} catch (error) {
			console.error('Error confirming booking:', error);
			if (error instanceof AxiosError) {
				alert('Booking failed');
			}
			alert(error.message || 'Failed to book workout. Please try again.');
		} finally {
			// Hide loading state (optional)
			setIsLoading(false); // You would need to add this state to your component
		}
	};

	return (
		<div className="fixed inset-0 z-90 flex text-gray-800 items-center justify-center px-5 bg-black/30">
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

				<div className="flex items-start justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full overflow-hidden border">
							<img
								src={coach.profileImageUrl}
								alt={`${firstName} ${lastName}`}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<p className="font-semibold text-lg text-gray-900">
								{firstName} {lastName}
							</p>
							<p className="text-sm text-gray-500">{title}</p>
							<p className="text-sm font-medium text-gray-800 flex items-center">
								{rating} <span className="text-yellow-400 ml-1">★</span>
							</p>
						</div>
					</div>

					<div className="text-sm text-gray-700 space-y-2">
						<div className="flex items-center gap-2">
							<Dumbbell className="w-4 h-4 text-gray-500" />
							<span>
								<strong>Type:</strong> {specializations[0] || 'N/A'}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-gray-500" />
							<span>
								<strong>Time:</strong> {selectedTimeHere.split('-')[0]}
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

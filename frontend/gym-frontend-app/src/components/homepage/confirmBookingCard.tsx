import React from 'react';
import { Calendar, Clock, Dumbbell, X } from 'lucide-react';
import Button from '../common/ButtonComponent';

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
	} = coach;

	const formattedDate = new Date().toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
	});

	const selectedTime = availableSlots?.[0]?.time || 'N/A';

	const handleConfirm = () => {
		console.log('Booking confirmed:', coach);
		onClose();
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
								<strong>Time:</strong> {selectedTime}
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
				>
					Confirm
				</Button>
			</div>
		</div>
	);
};

export default ConfirmBookingCard;

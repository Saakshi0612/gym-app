import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import Button from '../common/ButtonComponent';
import ConfirmBookingCard from './confirmBookingCard';
import LoginPromptModal from './isLoggedInCard';

interface Slot {
	_id: string;
	time: string;
}

interface CoachProps {
	_id: string;
	firstName: string;
	lastName: string;
	profileImageUrl?: string;
	specializations: string[];
	rating: number;
	title: string;
	about: string;
	availableSlots: Slot[];
}

interface ShowCochesCardProps {
	coach: CoachProps;
}

const ShowCochesCard: React.FC<ShowCochesCardProps> = ({ coach }) => {
	const [showModal, setShowModal] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();

	const handleBookingClick = () => {
		if (isAuthenticated) {
			setShowModal(true);
		} else {
			setShowLoginPrompt(true);
		}
	};

	return (
		<>
			<div className="w-full max-w-3xl p-4 shadow-xl rounded-2xl text-gray-700 bg-white relative z-10">
				<div className="flex flex-col md:flex-row justify-between gap-4">
					<div className="flex gap-4 md:gap-5 items-center lg:w-[300px]">
						<div className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-full overflow-hidden border shrink-0">
							{coach.profileImageUrl ? (
								<img
									src={coach.profileImageUrl}
									alt={`${coach.firstName} ${coach.lastName}`}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="h-full w-full bg-gray-300 flex items-center justify-center">
									<span className="text-white">No Image</span>
								</div>
							)}
						</div>
						<div>
							<p className="font-bold text-base md:text-lg">
								{coach.firstName} {coach.lastName}
							</p>
							<p className="lg:text-sm md:text-base md:w-auto">{coach.title}</p>
							<p className="mt-2 text-sm md:text-base">⭐ {coach.rating}</p>
						</div>
					</div>

					<div className="w-full md:w-auto">
						<fieldset className="border-2 border-primary-green rounded-xl px-1 py-2">
							<legend className="text-sm font-semibold px-2">
								Booking Details
							</legend>
							<div className="py-1 px-5 md:h-[120px] md:flex md:flex-col justify-between md:w-[250px] lg:w-[200px] text-gray-600">
								<div className="flex items-center gap-2 text-sm mt-2">
									<Dumbbell className="w-5 h-5" />
									<p>
										<strong>Type:</strong>{' '}
										{coach.specializations?.length > 0
											? coach.specializations[0] // Show only the first specialization if there's more than one
											: 'N/A'}
									</p>
								</div>

								<div className="flex items-center gap-2 text-sm mt-2">
									<Clock className="w-5 h-5" />
									<p>
										<strong>Time: </strong>1hr,{' '}
										{coach.availableSlots?.length > 0
											? (coach.availableSlots[0].time?.split('-')[0]?.trim() ??
												'N/A')
											: 'N/A'}
									</p>
								</div>

								<div className="flex items-center gap-2 text-sm mt-2 ">
									<Calendar className="w-5 h-5" />
									<p>
										<strong>Date:</strong>{' '}
										{new Date().toLocaleDateString('en-US', {
											month: 'long',
											day: 'numeric',
										})}
									</p>
								</div>
							</div>
						</fieldset>
					</div>
				</div>

				<div className="mt-3">
					<p className="text-gray-700 text-sm sm:line-clamp-3 lg:h-10 lg:line-clamp-2 text-justify">
						{coach.about ?? 'No description available.'}
					</p>
				</div>

				<div className="mt-4">
					<p className="text-sm font-medium">Also Available Time Slots:</p>
					<div className="flex flex-wrap mt-2 gap-2">
						{coach.availableSlots?.length > 1 ? (
							coach.availableSlots.slice(1).map((slot) => (
								<div key={slot._id} className="px-3 py-1 text-xs bg-green-100">
									{slot.time}
								</div>
							))
						) : (
							<p className="px-3 py-1 text-xs bg-green-100">
								No More Slots Available
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 mt-4">
					<Button
						variant="secondary"
						className="w-full sm:w-1/2 border border-gray-400 py-2 rounded-lg cursor-pointer"
					>
						<Link to={`/coaches/${coach._id}`}>Coach Profile</Link>
					</Button>

					<Button
						onClick={handleBookingClick}
						variant="primary"
						className="w-full sm:w-1/2 bg-primary-green text-black py-2 rounded-lg cursor-pointer"
					>
						Book Workout
					</Button>
				</div>
			</div>

			{showModal && (
				<ConfirmBookingCard coach={coach} onClose={() => setShowModal(false)} />
			)}

			<LoginPromptModal
				isOpen={showLoginPrompt}
				onCancel={() => setShowLoginPrompt(false)}
				onLogin={() => navigate('/login')}
			/>
		</>
	);
};

export default ShowCochesCard;

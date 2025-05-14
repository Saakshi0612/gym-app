import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import Button from '../common/ButtonComponent';
import LoginPromptModal from './isLoggedInCard';

interface Slot {
	_id: string;
	time_slot: string;
}

interface CoachData {
	_id: string;
	firstName: string;
	lastName: string;
	profileImageUrl?: string;
	specializations: string[];
	rating: number;
	title: string;
	about: string;
}

interface CoachProps {
	Coaches: CoachData;
	Available_Time_Slots: Slot[];
	selectedTime: Slot | string | null; // Updated type
	selectedDate: Date | string | null;
	_id: string;
}

interface ShowCochesCardProps {
	coach: CoachProps;
	onBookingClick: (coach: CoachProps) => void;
}

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const ShowCochesCard: React.FC<ShowCochesCardProps> = ({
	coach,
	onBookingClick,
}) => {
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();

	const coachInfo = coach.Coaches;

	// 🛠 Fix: safely extract time string from Slot object or fallback
	const selectedTime =
		coach.selectedTime && typeof coach.selectedTime === 'object'
			? coach.selectedTime.time_slot
			: (coach.selectedTime ?? 'Not Selected');

	const selectedDateFormatted = coach.selectedDate
		? `${months[new Date(coach.selectedDate).getMonth()]}, ${new Date(coach.selectedDate).getDate()}`
		: `${months[new Date().getMonth()]}, ${new Date().getDate()}`;

	const handleBookingClick = () => {
		if (isAuthenticated) {
			onBookingClick(coach);
		} else {
			setShowLoginPrompt(true);
		}
	};

	console.log('Coach from card : ', coach);

	return (
		<>
			<div className="w-full max-w-3xl p-4 pb-24 shadow-xl rounded-2xl text-gray-700 bg-white relative z-10">
				<div className="flex flex-col md:flex-row justify-between gap-4">
					<div className="flex gap-4 md:gap-5 items-center lg:w-[300px]">
						<div className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-full overflow-hidden border shrink-0">
							{coachInfo.profileImageUrl ? (
								<img
									src={coachInfo.profileImageUrl}
									alt={`${coachInfo.firstName} ${coachInfo.lastName}`}
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
								{coachInfo.firstName} {coachInfo.lastName}
							</p>
							<p className="lg:text-sm md:text-base md:w-auto">
								{coachInfo.title}
							</p>
							<p className="mt-2 text-sm md:text-base">⭐ {coachInfo.rating}</p>
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
										{coachInfo.specializations?.[0] ?? 'N/A'}
									</p>
								</div>

								<div className="flex items-center gap-2 text-sm mt-2">
									<Clock className="w-5 h-5" />
									<p>
										<strong>Time: </strong>1hr {selectedTime}
									</p>
								</div>

								<div className="flex items-center gap-2 text-sm mt-2">
									<Calendar className="w-5 h-5" />
									<p>
										<strong>Date:</strong> {selectedDateFormatted}
									</p>
								</div>
							</div>
						</fieldset>
					</div>
				</div>

				<div className="mt-3">
					<p className="text-gray-700 text-sm sm:line-clamp-3 lg:h-10 lg:line-clamp-2 text-justify">
						{coachInfo.about ?? 'No description available.'}
					</p>
				</div>

				<div className="mt-4">
					<p className="text-sm font-medium">Also Available Time Slots:</p>
					<div className="flex flex-wrap mt-2 gap-2">
						{coach.Available_Time_Slots?.length > 1 ? (
							coach.Available_Time_Slots.slice(1).map((slot) => (
								<div key={slot._id} className="px-3 py-1 text-xs bg-green-100">
									{slot.time_slot}
								</div>
							))
						) : (
							<p className="px-3 py-1 text-xs bg-green-100">
								No More Slots Available
							</p>
						)}
					</div>
				</div>

				<div className="absolute bottom-4 left-4 right-4">
					<div className="flex flex-col sm:flex-row gap-3">
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
			</div>

			{showLoginPrompt && (
				<LoginPromptModal
					isOpen={showLoginPrompt}
					onCancel={() => setShowLoginPrompt(false)}
					onLogin={() => navigate('/login')}
				/>
			)}
		</>
	);
};

export default ShowCochesCard;

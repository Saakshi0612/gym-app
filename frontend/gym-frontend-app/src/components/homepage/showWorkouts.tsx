/* eslint-disable */
// @ts-nocheck
import  { useEffect, useState } from 'react';
import ShowError from './searchError';
import ShowCochesCard from './showCoachCard';
import { useAppSelector } from '../../store/store';
import ConfirmBookingCard from './confirmBookingCard';
import { DropdownOption } from './Mainsection';

export default function ShowWorkouts({
	timeOptions,
}: {
	timeOptions: DropdownOption[];
}) {
	const { allCoachesWithSlots, loading, error } = useAppSelector(
		(state) => state.workout
	);

	const [selectedCoach, setSelectedCoach] = useState<any>(null);

	useEffect(() => {}, [allCoachesWithSlots]);

	const handleBookingClick = (coach) => {
		// When booking is clicked, include the selectedTime as part of the selected coach
		const selectedTime = coach.selectedTime;
		setSelectedCoach({
			...coach,
			selectedTime, // Make sure selectedTime is part of the selectedCoach object
		});
	};

	if (loading) {
		return (
			<div className="col-span-full flex justify-center mb-10">
				<p>Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="col-span-full flex justify-center mb-10">
				<ShowError />
			</div>
		);
	}

	if (!allCoachesWithSlots || allCoachesWithSlots.length === 0) {
		return (
			<div className="col-span-full flex justify-center mb-10">
				<ShowError />
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{allCoachesWithSlots.length === 0 ? (
					<p>No coaches available based on the selected filters.</p>
				) : (
					allCoachesWithSlots.map((coach: any) => {
						const time = timeOptions.filter((timeSlot) => {
							// console.log('All', allCoachesWithSlots);
							// console.log('timeslot ', timeSlot);
							// console.log('selected : ', coach.selectedTime);
							if (timeSlot.value === coach.selectedTime) return true;
						})[0];
						return (
							<ShowCochesCard
								key={coach._id}
								coach={{
									...coach,
									selectedTime: time || coach.availableSlots[0],
								}}
								onBookingClick={handleBookingClick}
							/>
						);
					})
				)}
			</div>

			{selectedCoach && (
				<ConfirmBookingCard
				coach={{
					...selectedCoach,
				}} // selectedCoach includes the selectedTime now
					onClose={() => setSelectedCoach(null)}
				/>
			)}
		</div>
	);
}

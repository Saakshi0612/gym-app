// /* eslint-disable */
// // @ts-nocheck
// import { useEffect, useState } from 'react';
// import ShowError from './searchError';
// import ShowCochesCard from './showCoachCard';
// import { useAppSelector } from '../../store/store';
// import ConfirmBookingCard from './confirmBookingCard';
// import { DropdownOption } from './Mainsection';

// export default function ShowWorkouts({
// 	timeOptions,
// 	selectedDate,
// }: {
// 	timeOptions: DropdownOption[];
// 	selectedDate: Date;
// }) {
// 	const { allCoachesWithSlots, loading, error } = useAppSelector(
// 		(state) => state.workout
// 	);

// 	const [selectedCoach, setSelectedCoach] = useState<any>(null);

// 	useEffect(() => {}, [allCoachesWithSlots]);

// 	const handleBookingClick = (coach) => {
// 		// When booking is clicked, include the selectedTime as part of the selected coach
// 		const selectedTime = coach.selectedTime;

// 		setSelectedCoach({
// 			...coach,
// 			selectedTime, // Ensure selectedTime is part of the selectedCoach object
// 		});
// 	};

// 	if (loading) {
// 		return (
// 			<div className="col-span-full flex justify-center mb-10">
// 				<p>Loading...</p>
// 			</div>
// 		);
// 	}

// 	if (error) {
// 		return (
// 			<div className="col-span-full flex justify-center mb-10">
// 				<ShowError />
// 			</div>
// 		);
// 	}

// 	if (!allCoachesWithSlots || allCoachesWithSlots.length === 0) {
// 		return (
// 			<div className="col-span-full flex justify-center mb-10">
// 				<ShowError />
// 			</div>
// 		);
// 	}

// 	return (
// 		<div>
// 			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// 				{allCoachesWithSlots.length === 0 ? (
// 					<p>No coaches available based on the selected filters.</p>
// 				) : (
// 					allCoachesWithSlots.map((coach: any) => {
// 						const time = timeOptions.find(
// 							(timeSlot) => timeSlot.value === coach.selectedTime
// 						);

// 						const safeSelectedTime =
// 							time ||
// 							(coach.Available_Time_Slots &&
// 							coach.Available_Time_Slots.length > 0
// 								? coach.Available_Time_Slots[0]
// 								: null);

// 						return (
// 							<ShowCochesCard
// 								key={coach._id}
// 								coach={{
// 									...coach,
// 									selectedTime: safeSelectedTime,
// 									selectedDate: selectedDate, // ✅ pass selectedDate here
// 								}}
// 								onBookingClick={handleBookingClick}
// 							/>
// 						);
// 					})
// 				)}
// 			</div>

// 			{selectedCoach && (
// 				<ConfirmBookingCard
// 					coach={{
// 						...selectedCoach,
// 					}} // selectedCoach includes selectedTime now
// 					onClose={() => setSelectedCoach(null)}
// 				/>
// 			)}
// 		</div>
// 	);
// }

/* eslint-disable */
// @ts-nocheck
import { useEffect, useState } from 'react';
import ShowError from './searchError';
import ShowCochesCard from './showCoachCard';
import { useAppSelector } from '../../store/store';
import ConfirmBookingCard from './confirmBookingCard';
import { DropdownOption } from './Mainsection';

export default function ShowWorkouts({
	timeOptions,
	selectedDate,
}: {
	timeOptions: DropdownOption[];
	selectedDate: Date;
}) {
	const {
		allCoachesWithSlots = [],
		loading,
		error,
	} = useAppSelector((state) => state.workout);

	const [selectedCoach, setSelectedCoach] = useState<any>(null);

	useEffect(() => {
		console.log('allCoachesWithSlots:', allCoachesWithSlots);
	}, [allCoachesWithSlots]);

	const handleBookingClick = (coach) => {
		const selectedTime = coach.selectedTime;

		setSelectedCoach({
			...coach,
			selectedTime,
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

	if (!Array.isArray(allCoachesWithSlots) || allCoachesWithSlots.length === 0) {
		return (
			<div className="col-span-full flex justify-center mb-10">
				<ShowError />
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{allCoachesWithSlots.map((coach: any) => {
					const time = timeOptions.find(
						(timeSlot) => timeSlot.value === coach.selectedTime
					);

					const safeSelectedTime =
						time ||
						(coach.Available_Time_Slots && coach.Available_Time_Slots.length > 0
							? coach.Available_Time_Slots[0]
							: null);

					return (
						<ShowCochesCard
							key={coach._id}
							coach={{
								...coach,
								selectedTime: safeSelectedTime,
								selectedDate: selectedDate,
							}}
							onBookingClick={handleBookingClick}
						/>
					);
				})}
			</div>

			{selectedCoach && (
				<ConfirmBookingCard
					coach={{ ...selectedCoach }}
					onClose={() => setSelectedCoach(null)}
				/>
			)}
		</div>
	);
}

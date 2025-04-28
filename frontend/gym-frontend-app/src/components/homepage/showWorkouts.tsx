import React, { useEffect, useState } from 'react';
import ShowError from './searchError';
import ShowCochesCard from './showCoachCard';
import { useAppSelector } from '../../store/store';
import ConfirmBookingCard from './confirmBookingCard';

export default function ShowWorkouts() {
	const { allCoachesWithSlots, loading, error } = useAppSelector(
		(state) => state.workout
	);

	const [selectedCoach, setSelectedCoach] = useState(null);

	useEffect(() => {
		console.log('All Coaches with Slots:', allCoachesWithSlots); // Log the data for debugging
	}, [allCoachesWithSlots]);

	const handleBookingClick = (coach) => {
		setSelectedCoach(coach);
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
					allCoachesWithSlots.map((coach: any) => (
						<ShowCochesCard
							key={coach._id}
							coach={coach}
							onBookingClick={handleBookingClick}
						/>
					))
				)}
			</div>

			{selectedCoach && (
				<ConfirmBookingCard
					coach={selectedCoach}
					onClose={() => setSelectedCoach(null)}
				/>
			)}
		</div>
	);
}

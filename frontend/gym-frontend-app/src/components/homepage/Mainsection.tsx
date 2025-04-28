import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchWorkoutData, filterWorkout } from '../../services/workoutSlice';
import Arrow from '../../assets/images/arrow.svg';
import Underlined from '../../assets/images/fitnessg.svg';

import ShowWorkouts from './showWorkouts';
import DropdownField from '../common/Selection';
import Button from '../common/ButtonComponent';
import DatePickerField from '../common/DatePickerField';

// Types
export type DropdownOption = {
	value: string;
	label: string;
};

const MainSection: React.FC = () => {
	const dispatch = useAppDispatch();

	const {
		coaches,
		specializations,
		availableTimeSlots,
		allCoachesWithSlots,
		loading,
		error,
	} = useAppSelector((state) => state.workout);

	const [filters, setFilters] = useState({
		date: new Date(), // Default to today
	});

	const handleDateChange = (selectedDate: Date) => {
		console.log('New date selected:', selectedDate);
		setFilters((prev) => {
			const newFilters = { ...prev, date: selectedDate };
			console.log('Updated filters:', newFilters);
			return newFilters;
		});
	};

	const [selectedSport, setSelectedSport] = useState<DropdownOption>({
		value: 'All',
		label: 'All',
	});

	const [selectedTime, setSelectedTime] = useState<DropdownOption>({
		value: 'All',
		label: 'All',
	});

	const [selectedCoach, setSelectedCoach] = useState<DropdownOption>({
		value: 'All',
		label: 'All',
	});

	useEffect(() => {
		dispatch(fetchWorkoutData());
	}, [dispatch]);

	// Dropdown options
	const coachOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...coaches.map((coach) => ({
			value: coach.id,
			label: coach.name,
		})),
	];

	const timeOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...availableTimeSlots.map((slot) => ({
			value: slot.id,
			label: slot.slot,
		})),
	];

	console.log(timeOptions);

	const sportOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...Array.from(new Set(specializations.map((s) => s.specialization))).map(
			(specialization) => ({
				value: specialization,
				label: specialization,
			})
		),
	];

	const handleFindWorkout = () => {
		// Make sure we're using the most current date from state
		console.log('Current date in state:', filters.date);

		// Format the date as YYYY-MM-DD for the API
		const formattedDate = filters.date.toISOString().split('T')[0];

		const payload = {
			coach_id: selectedCoach.value === 'All' ? '' : selectedCoach.value,
			sport_name: selectedSport.value === 'All' ? '' : selectedSport.value,
			date: formattedDate,
			time_slot: selectedTime.value === 'All' ? '' : selectedTime.value,
		};

		console.log('payload with formatted date:', payload);

		dispatch(filterWorkout(payload)); // Dispatch the filtering action with the updated payload
	};

	return (
		<div>
			<main>
				<div className="flex flex-col lg:text-5xl md:text-4xl sm:text-3xl p-10 gap-4">
					<h1>
						Achieve your{' '}
						<span className="relative inline-block z-10">
							fitness goals!
							<span className="absolute left-0 bottom-[-16px] w-full h-[8px] z-0">
								<img src={Underlined} alt="" />
							</span>
						</span>
					</h1>

					<h2 className="flex flex-row gap-4 lg:text-5xl md:text-4xl sm:text-3xl text-center mb-4">
						Find a workout and book today.
						<img src={Arrow} className="hidden sm:inline-block" />
					</h2>
				</div>

				<div className="text-base mt-2 px-4 md:px-10 space-y-5">
					<h2 className="text-gray-800 font-medium">Book workout</h2>

					{loading && <p>Loading workouts...</p>}
					{error && <p className="text-red-500">{error}</p>}

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end w-full">
						<div className="z-40">
							<DropdownField
								label="Type of Sport"
								options={sportOptions}
								name="type"
								value={selectedSport.label}
								onChange={(value: string) => {
									const selected = sportOptions.find(
										(opt) => opt.value === value
									);
									if (selected) setSelectedSport(selected);
								}}
							/>
						</div>

						<DatePickerField
							label="Workout Date"
							value={filters.date}
							onChange={handleDateChange}
						/>

						<div className="z-30">
							<DropdownField
								label="Time"
								options={timeOptions}
								name="time"
								value={selectedTime.label}
								onChange={(value: string) => {
									const selected = timeOptions.find(
										(opt) => opt.value === value
									);
									if (selected) setSelectedTime(selected);
								}}
							/>
						</div>

						<div className="z-20">
							<DropdownField
								label="Coach"
								options={coachOptions}
								name="coach"
								value={selectedCoach.label}
								onChange={(value: string) => {
									const selected = coachOptions.find(
										(opt) => opt.value === value
									);
									if (selected) setSelectedCoach(selected);
								}}
							/>
						</div>

						<div className="w-full sm:col-span-2 md:col-span-4 lg:col-span-1 flex justify-center lg:justify-start">
							<Button
								variant="primary"
								className="text-sm w-full sm:w-auto md:w-1/3 lg:w-full"
								onClick={handleFindWorkout}
							>
								Find Workout
							</Button>
						</div>
					</div>

					<ShowWorkouts timeOptions={timeOptions} />
				</div>
			</main>
		</div>
	);
};

export default MainSection;

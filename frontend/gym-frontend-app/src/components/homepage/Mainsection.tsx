/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchWorkoutData, filterWorkout } from '../../services/workoutSlice';
import Arrow from '../../assets/images/arrow.svg';
import Underlined from '../../assets/images/fitnessg.svg';

import ShowWorkouts from './showWorkouts';
import DropdownField from '../common/Selection';
import Button from '../common/ButtonComponent';
import DatePickerField from '../common/DatePickerField';

export type DropdownOption = {
	value: string;
	label: string;
};

const MainSection: React.FC = () => {
	const dispatch = useAppDispatch();

	const {
		coaches = [],
		specializations = [],
		availableTimeSlots = [],
		loading,
		error,
	} = useAppSelector((state) => state.workout);

	const [filters, setFilters] = useState({
		date: new Date(),
	});

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

	const coachOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...coaches.map((coach) => ({
			value: coach.id,
			label: `${coach.firstName} ${coach.lastName}`,
		})),
	];

	const timeOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...availableTimeSlots.map((slot) => ({
			value: slot.id,
			label: slot.time_slot, // Fixed here
		})),
	];

	const sportOptions: DropdownOption[] = [
		{ value: 'All', label: 'All' },
		...specializations.map((spec) => ({
			value: spec,
			label: spec,
		})),
	];

	const handleDateChange = (selectedDate: Date) => {
		setFilters((prev) => ({ ...prev, date: selectedDate }));
	};

	const handleFindWorkout = () => {
		const formattedDate = filters.date
			.toLocaleDateString('en-IN')
			.split('/')
			.reverse()
			.join('-');

		const payload = {
			coach: selectedCoach.value === 'All' ? '' : selectedCoach.value,
			sport_type: selectedSport.value === 'All' ? '' : selectedSport.value,
			date: formattedDate,
			slot_id: selectedTime.value === 'All' ? '' : selectedTime.value,
		};

		console.log('Payloads : ', payload);
		dispatch(filterWorkout(payload));
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

					<ShowWorkouts timeOptions={timeOptions} selectedDate={filters.date} />
				</div>
			</main>
		</div>
	);
};

export default MainSection;

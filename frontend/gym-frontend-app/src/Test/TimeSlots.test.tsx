/* eslint-disable */
// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import TimeSlots from '../components/CoachComponents/TimeSlots';

describe('TimeSlots Component', () => {
  // Mock data for testing
  const mockDate = new Date('2023-06-15');
  const mockTimeSlots = [
    { id: '1', startTime: '9:00 AM', endTime: '10:00 AM', isAvailable: true },
    { id: '2', startTime: '10:00 AM', endTime: '11:00 AM', isAvailable: true },
    { id: '3', startTime: '11:00 AM', endTime: '12:00 PM', isAvailable: false },
  ];
  const mockSelectedTimeSlotId = '1';
  const mockOnTimeSlotSelect = vi.fn();

  it('renders the date correctly', () => {
    render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Check if the date is formatted and displayed correctly
    expect(screen.getByText('Jun 15')).toBeInTheDocument();
  });

  it('displays the correct number of available slots', () => {
    render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Check if the available slots count is displayed correctly
    expect(screen.getByText('2 slots available')).toBeInTheDocument();
  });

  it('renders all time slots', () => {
    render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Check if all time slots are rendered
    expect(screen.getByText('9:00 AM - 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 11:00 AM')).toBeInTheDocument();
    expect(screen.getByText('11:00 AM - 12:00 PM')).toBeInTheDocument();
  });

  it('applies selected styling to the selected time slot', () => {
    const { container } = render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Find the selected button
    const selectedButton = screen.getByText('9:00 AM - 10:00 AM');
    
    // Check if it has the border class for selected state
    expect(selectedButton.className).toContain('border-green-500');
  });

  it('disables unavailable time slots', () => {
    render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Find the unavailable time slot button
    const unavailableButton = screen.getByText('11:00 AM - 12:00 PM');
    
    // Check if it's disabled
    expect(unavailableButton).toBeDisabled();
    expect(unavailableButton.className).toContain('cursor-not-allowed');
  });

  it('calls onTimeSlotSelect when a time slot is clicked', () => {
    render(
      <TimeSlots
        selectedDate={mockDate}
        timeSlots={mockTimeSlots}
        selectedTimeSlotId={mockSelectedTimeSlotId}
        onTimeSlotSelect={mockOnTimeSlotSelect}
      />
    );
    
    // Click on an available time slot
    const availableButton = screen.getByText('10:00 AM - 11:00 AM');
    fireEvent.click(availableButton);
    
    // Check if the callback was called with the correct time slot
    expect(mockOnTimeSlotSelect).toHaveBeenCalledWith(mockTimeSlots[1]);
  });
});
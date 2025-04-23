/* eslint-disable */
// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CoachAvailabilityCalendar from '../components/CoachComponents/CoachCalendar';

// No need to mock the components - we'll test with the actual components

describe('CoachAvailabilityCalendar Component', () => {
  const mockOnTimeSlotSelect = vi.fn();
  const mockOnDateChange = vi.fn();
  const initialDate = new Date(2023, 6, 1); // July 1, 2023
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a fixed date for "today" to make tests predictable
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 6, 1)); // July 1, 2023
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('renders the component with Calendar and TimeSlots', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    expect(screen.getByText('SCHEDULE')).toBeInTheDocument();
    // Check for calendar elements
    expect(screen.getByText('July 2023')).toBeInTheDocument();
    expect(screen.getByText('SUN')).toBeInTheDocument();
    
    // Check for time slots elements
    expect(screen.getByText('Jul 1')).toBeInTheDocument();
    expect(screen.getByText('4 slots available')).toBeInTheDocument();
  });
  
  it('displays the correct month and available time slots', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Check month display
    expect(screen.getByText('July 2023')).toBeInTheDocument();
    
    // Check time slots
    expect(screen.getByText('8:00 - 9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('9:00 - 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 11:00 AM')).toBeInTheDocument();
    expect(screen.getByText('3:00 - 4:00 PM')).toBeInTheDocument();
  });
  
  it('calls onTimeSlotSelect when a time slot is clicked', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Find and click a time slot
    const timeSlot = screen.getByText('8:00 - 9:00 AM');
    fireEvent.click(timeSlot);
    
    // Check if the callback was called with the correct time slot
    expect(mockOnTimeSlotSelect).toHaveBeenCalledTimes(1);
    expect(mockOnTimeSlotSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        startTime: '8:00',
        endTime: '9:00 AM',
        isAvailable: true
      })
    );
  });
  
  it('calls onDateChange when a date is selected', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Find a future date in the calendar (e.g., the 15th)
    // We need to find a date that's not in the past and is visible in the current month
    const futureDate = screen.getByText('15'); // July 15th
    fireEvent.click(futureDate);
    
    // Check if the callback was called
    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    const calledWithDate = mockOnDateChange.mock.calls[0][0];
    expect(calledWithDate.getFullYear()).toBe(2023);
    expect(calledWithDate.getMonth()).toBe(6); // July
    expect(calledWithDate.getDate()).toBe(15);
  });
  
  it('updates the displayed date when a new date is selected', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Initially, we should see Jul 1
    expect(screen.getByText('Jul 1')).toBeInTheDocument();
    
    // Click on July 15th
    const futureDate = screen.getByText('15');
    fireEvent.click(futureDate);
    
    // Now we should see Jul 15
    expect(screen.getByText('Jul 15')).toBeInTheDocument();
  });
  
  it('changes the month when the next month button is clicked', () => {
    render(
      <CoachAvailabilityCalendar 
        initialDate={initialDate}
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Initially, we should see July 2023
    expect(screen.getByText('July 2023')).toBeInTheDocument();
    
    // Find the next month button (right arrow)
    const buttons = screen.getAllByRole('button');
    const nextMonthButton = buttons.find(button => 
      button.innerHTML.includes('path clip-rule="evenodd" d="M16.28 11.47') // Right arrow path
    );
    
    if (nextMonthButton) {
      fireEvent.click(nextMonthButton);
      
      // Now we should see August 2023
      expect(screen.getByText('August 2023')).toBeInTheDocument();
    }
  });
  
  it('uses current date as default when initialDate is not provided', () => {
    // We're using fake timers set to July 1, 2023
    render(
      <CoachAvailabilityCalendar 
        onTimeSlotSelect={mockOnTimeSlotSelect}
        onDateChange={mockOnDateChange}
      />
    );
    
    // Should display July 2023 and Jul 1
    expect(screen.getByText('July 2023')).toBeInTheDocument();
    expect(screen.getByText('Jul 1')).toBeInTheDocument();
  });
});
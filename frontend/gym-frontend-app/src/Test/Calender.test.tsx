import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Calendar from '../components/common/Calender';

describe('Calendar Component', () => {
  // Default props for most tests
  const defaultProps = {
    currentDate: new Date(2023, 6, 15), // July 15, 2023
    selectedDate: new Date(2023, 6, 15), // July 15, 2023
    onDateSelect: vi.fn(),
    onMonthChange: vi.fn(),
  };

  beforeEach(() => {
    // Mock the current date to be consistent in tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 6, 1)); // July 1, 2023
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Other tests remain the same...

  it('calls onMonthChange when next month button is clicked', () => {
    render(<Calendar {...defaultProps} />);
    
    // Find the month navigation section
    const monthYearText = screen.getByText('July 2023');
    const navigationContainer = monthYearText.parentElement;
    
    if (!navigationContainer) {
      throw new Error('Navigation container not found');
    }
    
    // Get all buttons in the navigation container
    const buttons = navigationContainer.querySelectorAll('button');
    
    // The next month button should be the second button (index 1)
    const nextMonthButton = buttons[1];
    
    if (!nextMonthButton) {
      throw new Error('Next month button not found');
    }
    
    fireEvent.click(nextMonthButton);
    expect(defaultProps.onMonthChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWithDate = defaultProps.onMonthChange.mock.calls[0][0];
    expect(calledWithDate.getFullYear()).toBe(2023);
    expect(calledWithDate.getMonth()).toBe(7); // August
  });

  it('calls onMonthChange when previous month button is clicked if not before current month', () => {
    // Set current date to August to allow going back to July
    const augustProps = {
      ...defaultProps,
      currentDate: new Date(2023, 7, 15), // August 15, 2023
    };
    
    render(<Calendar {...augustProps} />);
    
    // Find the month navigation section
    const monthYearText = screen.getByText('August 2023');
    const navigationContainer = monthYearText.parentElement;
    
    if (!navigationContainer) {
      throw new Error('Navigation container not found');
    }
    
    // Get all buttons in the navigation container
    const buttons = navigationContainer.querySelectorAll('button');
    
    // The previous month button should be the first button (index 0)
    const prevMonthButton = buttons[0];
    
    if (!prevMonthButton) {
      throw new Error('Previous month button not found');
    }
    
    fireEvent.click(prevMonthButton);
    expect(defaultProps.onMonthChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWithDate = defaultProps.onMonthChange.mock.calls[0][0];
    expect(calledWithDate.getFullYear()).toBe(2023);
    expect(calledWithDate.getMonth()).toBe(6); // July
  });

  it('disables previous month button if current month is displayed', () => {
    // System time is July 1, 2023
    render(<Calendar {...defaultProps} />);
    
    // Find the month navigation section
    const monthYearText = screen.getByText('July 2023');
    const navigationContainer = monthYearText.parentElement;
    
    if (!navigationContainer) {
      throw new Error('Navigation container not found');
    }
    
    // Get all buttons in the navigation container
    const buttons = navigationContainer.querySelectorAll('button');
    
    // The previous month button should be the first button (index 0)
    const prevMonthButton = buttons[0];
    
    if (!prevMonthButton) {
      throw new Error('Previous month button not found');
    }
    
    expect(prevMonthButton).toHaveClass('opacity-30');
    expect(prevMonthButton).toHaveClass('cursor-not-allowed');
    expect(prevMonthButton).toBeDisabled();
  });

  // Rest of the tests remain the same...
});
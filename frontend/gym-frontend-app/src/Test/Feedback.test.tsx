/* eslint-disable */
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import FeedbackSection from '../components/FeedBack/FeedBack';

// Mock the fetchFeedbackData function to control its behavior
vi.mock('../../assets/JSON/Feedback.json', () => ({
  default: {
    feedbacks: [] // Empty array to keep the component in loading state
  }
}));

// Mock the FeedbackCard component completely to avoid StarIcon issues
vi.mock('../../components/FeedBack/FeedBackCard', () => ({
  default: () => <div data-testid="mocked-feedback-card">Mocked Feedback Card</div>
}));

// Mock all Heroicons
vi.mock('@heroicons/react/24/solid', () => ({
  ChevronDownIcon: () => <svg data-testid="chevron-down-icon" />,
  StarIcon: () => <svg data-testid="star-icon" />
}));

describe('FeedbackSection Component', () => {
  it('renders loading state initially', () => {
    render(<FeedbackSection />);
    expect(screen.getByText('Loading feedback...')).toBeInTheDocument();
  });
});
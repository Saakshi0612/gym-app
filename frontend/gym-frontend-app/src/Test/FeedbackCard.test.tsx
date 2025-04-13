import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import FeedbackCard from '../components/FeedBack/FeedBackCard';
// Mock the StarIcon from Heroicons
vi.mock('@heroicons/react/24/solid', () => ({
  StarIcon: () => <svg data-testid="star-icon" />
}));

describe('FeedbackCard Component', () => {
  const mockProps = {
    name: 'John Doe',
    date: 'June 15, 2023',
    rating: 4,
    review: 'Great trainer, very knowledgeable and helpful.',
    avatarUrl: 'https://example.com/avatar.jpg'
  };

  it('renders the user name and date', () => {
    render(<FeedbackCard {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
  });

  it('renders the review text', () => {
    render(<FeedbackCard {...mockProps} />);
    
    expect(screen.getByText('Great trainer, very knowledgeable and helpful.')).toBeInTheDocument();
  });

  it('renders the user avatar with correct alt text', () => {
    render(<FeedbackCard {...mockProps} />);
    
    const avatar = screen.getByAltText("John Doe's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders the correct number of star icons', () => {
    render(<FeedbackCard {...mockProps} />);
    
    // Check if 5 star icons are rendered
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
  });
});
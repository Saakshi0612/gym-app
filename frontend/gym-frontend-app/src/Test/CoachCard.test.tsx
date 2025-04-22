
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import CoachCard from '../components/CoachComponents/CoachCard';

describe('CoachCard Component', () => {
  // Default props for testing
  const defaultProps = {
    name_of_coach: 'John Doe',
    rating: 4.8,
    title: 'Fitness Expert',
    description: 'Experienced coach specializing in strength training and nutrition guidance.',
    imageUrl: 'https://example.com/coach-image.jpg',
    onBookWorkout: vi.fn(),
  };

  it('renders the coach card with all information', () => {
    render(<CoachCard {...defaultProps} />);
    
    // Check if name, title, and description are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Fitness Expert')).toBeInTheDocument();
    expect(screen.getByText('Experienced coach specializing in strength training and nutrition guidance.')).toBeInTheDocument();
    
    // Check if rating is displayed correctly
    expect(screen.getByText('4.8')).toBeInTheDocument();
    
    // Check if the image is rendered with correct src
    // Using querySelector directly since getByRole('img') might not work if img has no alt text
    const image = document.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/coach-image.jpg');
    
    // Check if the Book Workout button is rendered
    expect(screen.getByText('Book Workout')).toBeInTheDocument();
  });

  it('calls onBookWorkout with coach name when the button is clicked', () => {
    render(<CoachCard {...defaultProps} />);
    
    const bookButton = screen.getByText('Book Workout');
    fireEvent.click(bookButton);
    
    expect(defaultProps.onBookWorkout).toHaveBeenCalledTimes(1);
    expect(defaultProps.onBookWorkout).toHaveBeenCalledWith(expect.anything(), 'John Doe');
  });

  it('renders the correct rating with one decimal place', () => {
    // Test with different rating values
    const props = {
      ...defaultProps,
      rating: 3.75
    };
    
    render(<CoachCard {...props} />);
    expect(screen.getByText('3.8')).toBeInTheDocument(); // Should round to one decimal place
  });

  it('applies proper styling to the card', () => {
    render(<CoachCard {...defaultProps} />);
    
    // Check main container styling
    const cardContainer = screen.getByText('John Doe').closest('div.bg-white');
    expect(cardContainer).toHaveClass('bg-white');
    expect(cardContainer).toHaveClass('rounded-lg');
    expect(cardContainer).toHaveClass('shadow-lg');
    
    // Check image container using querySelector
    const image = document.querySelector('img');
    const imageContainer = image?.closest('div');
    expect(imageContainer).toHaveClass('h-48');
    
    // Check button styling
    const button = screen.getByText('Book Workout');
    const buttonElement = button.closest('button');
    expect(buttonElement).toHaveClass('bg-primary-green');
    expect(buttonElement).toHaveClass('text-black');
  });

  it('truncates long descriptions with line-clamp', () => {
    const longDescription = 'This is a very long description that should be truncated. '.repeat(10);
    const props = {
      ...defaultProps,
      description: longDescription
    };
    
    render(<CoachCard {...props} />);
    
    // Find the paragraph element that contains part of the description
    // Using a substring of the long text
    const descriptionElement = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && 
             content.includes('This is a very long description');
    });
    
    expect(descriptionElement).toHaveClass('line-clamp-3');
  });

  it('renders with minimum required props', () => {
    // Test with minimal props
    const minimalProps = {
      name_of_coach: 'Jane Smith',
      rating: 3.0,
      title: 'Yoga Instructor',
      description: 'Yoga expert',
      imageUrl: 'https://example.com/jane.jpg',
      onBookWorkout: vi.fn(),
    };
    
    render(<CoachCard {...minimalProps} />);
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
    expect(screen.getByText('Yoga Instructor')).toBeInTheDocument();
    expect(screen.getByText('Yoga expert')).toBeInTheDocument();
  });

  it('renders the star icon for ratings', () => {
    render(<CoachCard {...defaultProps} />);
    
    // Check if the SVG star icon is rendered
    const ratingContainer = screen.getByText('4.8').parentElement;
    const starIcon = ratingContainer?.querySelector('svg');
    expect(starIcon).toBeInTheDocument();
    expect(starIcon).toHaveClass('text-yellow-400');
  });
});
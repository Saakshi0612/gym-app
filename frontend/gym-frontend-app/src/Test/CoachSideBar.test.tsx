/* eslint-disable */
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import CoachSidebar from '../components/CoachComponents/CoachSideBar';

// Mock the PDF icon import
vi.mock('../../assets/PDF.svg', () => 'mocked-pdf-icon.svg');

describe('CoachSidebar Component', () => {
  // Minimal props for testing
  const mockProps = {
    name_of_coach: 'John Doe',
    about: 'Experienced fitness trainer with 5+ years of experience.',
    rating: 4.8,
    title: 'Certified Personal Trainer',
    specializations: ['Strength Training', 'HIIT'],
    certificates: [
      { name: 'Personal Training Certification.pdf', file: '/cert1.pdf' },
      { name: 'Nutrition Specialist.pdf', file: '/cert2.pdf' }
    ],
    profileImage: 'https://example.com/profile.jpg'
  };

  it('renders coach name and rating', () => {
    render(<CoachSidebar {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('renders coach title and about section', () => {
    render(<CoachSidebar {...mockProps} />);
    
    expect(screen.getByText('Certified Personal Trainer')).toBeInTheDocument();
    expect(screen.getByText('Experienced fitness trainer with 5+ years of experience.')).toBeInTheDocument();
  });

  it('renders specializations', () => {
    render(<CoachSidebar {...mockProps} />);
    
    expect(screen.getByText('Strength Training')).toBeInTheDocument();
    expect(screen.getByText('HIIT')).toBeInTheDocument();
  });

  it('renders certificates with links', () => {
    render(<CoachSidebar {...mockProps} />);
    
    const certLink1 = screen.getByText('Personal Training Certification.pdf');
    expect(certLink1).toBeInTheDocument();
    expect(certLink1.tagName).toBe('A');
    expect(certLink1).toHaveAttribute('href', '/cert1.pdf');
    
    const certLink2 = screen.getByText('Nutrition Specialist.pdf');
    expect(certLink2).toBeInTheDocument();
    expect(certLink2).toHaveAttribute('href', '/cert2.pdf');
  });

  it('renders action buttons', () => {
    render(<CoachSidebar {...mockProps} />);
    
    expect(screen.getByText('Book Workout')).toBeInTheDocument();
    expect(screen.getByText('Repeat Previous Workout')).toBeInTheDocument();
  });

  it('renders profile image with correct alt text', () => {
    render(<CoachSidebar {...mockProps} />);
    
    const image = screen.getByAltText('John Doe - Trainer');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });
});
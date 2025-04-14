import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CoachProfilePage from '../pages/user_pages/CoachProfilePages';

// Mock the JSON import
vi.mock('../../assets/JSON/Coaches.json', () => ({
  default: {
    coaches: [
      {
        id: 1,
        name_of_coach: 'John Doe',
        rating: 4.8,
        title: 'Fitness Expert',
        description: 'Fitness description',
        imageUrl: 'https://example.com/john.jpg',
        type_of_sport: 'Fitness'
      }
    ]
  }
}));

describe('CoachProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('displays loading spinner initially', () => {
    render(
      <MemoryRouter initialEntries={['/coaches/1']}>
        <Routes>
          <Route path="/coaches/:id" element={<CoachProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check for the loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders page content after loading', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/coaches/1']}>
        <Routes>
          <Route path="/coaches/:id" element={<CoachProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for loading to finish
    await waitFor(() => {
      // The loading spinner should disappear
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
    
    // Check that the main container is rendered
    const mainContainer = container.querySelector('.p-4.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('displays error message when coach is not found', async () => {
    render(
      <MemoryRouter initialEntries={['/coaches/999']}>
        <Routes>
          <Route path="/coaches/:id" element={<CoachProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Coach not found')).toBeInTheDocument();
    });
  });
});
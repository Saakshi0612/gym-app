import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CoachProfilePage from '../pages/user_pages/CoachProfilePages';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../services/authSlice';

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

// Create a mock store
const createMockStore = (initialState = { auth: { isAuthenticated: false } }) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers as needed
    },
    preloadedState: initialState
  });
};

describe('CoachProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('displays loading spinner initially', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/coaches/1']}>
          <Routes>
            <Route path="/coaches/:id" element={<CoachProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Check for the loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders page content after loading', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/coaches/1']}>
          <Routes>
            <Route path="/coaches/:id" element={<CoachProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
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
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/coaches/999']}>
          <Routes>
            <Route path="/coaches/:id" element={<CoachProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Coach not found')).toBeInTheDocument();
    });
  });
});
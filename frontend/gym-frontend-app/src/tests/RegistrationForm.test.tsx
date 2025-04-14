// src/tests/RegistrationForm.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../components/RegisterForm';
import { store } from '../store/store';

// Mock the registerUser thunk
vi.mock('../services/authSlice', async () => {
  const actual = await vi.importActual('../services/authSlice');
  return {
    ...actual,
    registerUser: vi.fn(() => async () => ({
      type: 'auth/registerUser/fulfilled',
      payload: { success: true }
    }))
  };
});

const renderWithProviders = () =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <RegistrationForm />
      </BrowserRouter>
    </Provider>
  );

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs correctly', () => {
    renderWithProviders();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create An Account/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole('button', { name: /Create An Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    renderWithProviders();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password1');

    fireEvent.click(screen.getByRole('button', { name: /Create An Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Creating Account/i)).toBeInTheDocument();
    });
  });

  it('allows user to select dropdown values', async () => {
    renderWithProviders();

    // Click on the "Your Target" dropdown trigger
    const targetDropdownTrigger = screen.getByRole('button', { name: /lose-weight/i });
    fireEvent.mouseDown(targetDropdownTrigger);

    // Wait for the dropdown to open and select an option
    const targetOption = await screen.findByText(/gain-muscle/i);
    fireEvent.click(targetOption);

    // Verify that the selected value is displayed
    expect(screen.getByRole('button', { name: /gain-muscle/i })).toBeInTheDocument();

    // Repeat for "Preferable Activity" dropdown
    const activityDropdownTrigger = screen.getByRole('button', { name: /yoga/i });
    fireEvent.mouseDown(activityDropdownTrigger);

    const activityOption = await screen.findByText(/running/i);
    fireEvent.click(activityOption);

    expect(screen.getByRole('button', { name: /running/i })).toBeInTheDocument();
  });

  it('displays success alert on successful registration', async () => {
    renderWithProviders();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Smith');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'StrongPass1');

    fireEvent.click(screen.getByRole('button', { name: /Create An Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
    });
  });
});
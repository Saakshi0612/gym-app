import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // 👈 Import from vitest
import SystemAlert from '../components/SystemAlert';

describe('SystemAlert Component', () => {
  it('renders success alert with correct text and icon', () => {
    const mockDismiss = vi.fn(); // 👈 Use vi.fn()

    render(
      <SystemAlert
        type="success"
        message="Success Message"
        onDismiss={mockDismiss}
      />
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Success Message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders error alert with correct text and icon', () => {
    const mockDismiss = vi.fn(); // 👈 Use vi.fn()

    render(
      <SystemAlert
        type="error"
        message="Error Message"
        onDismiss={mockDismiss}
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error Message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const mockDismiss = vi.fn(); // 👈 Use vi.fn()

    render(
      <SystemAlert
        type="error"
        message="Dismiss me"
        onDismiss={mockDismiss}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('always passes', () => {
    expect(true).toBe(true);
  });
});

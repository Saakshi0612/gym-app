
/* eslint-disable */
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginPromptModal from '../components/homepage/isLoggedInCard';

// Mock the Button component
vi.mock('../common/ButtonComponent', () => ({
  default: ({ children, onClick, variant }) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

describe('LoginPromptModal', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <LoginPromptModal 
        isOpen={false} 
        onCancel={() => {}} 
        onLogin={() => {}} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <LoginPromptModal 
        isOpen={true} 
        onCancel={() => {}} 
        onLogin={() => {}} 
      />
    );
    
    expect(screen.getByText('Log in to book workout')).toBeInTheDocument();
    expect(screen.getByText(/You must be logged in to book a workout/)).toBeInTheDocument();
  });

  it('should call onCancel when close button is clicked', async () => {
    const onCancelMock = vi.fn();
    const user = userEvent.setup();
    
    render(
      <LoginPromptModal 
        isOpen={true} 
        onCancel={onCancelMock} 
        onLogin={() => {}} 
      />
    );
    
    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    const onCancelMock = vi.fn();
    const user = userEvent.setup();
    
    render(
      <LoginPromptModal 
        isOpen={true} 
        onCancel={onCancelMock} 
        onLogin={() => {}} 
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('should call onLogin when Log In button is clicked', async () => {
    const onLoginMock = vi.fn();
    const user = userEvent.setup();
    
    render(
      <LoginPromptModal 
        isOpen={true} 
        onCancel={() => {}} 
        onLogin={onLoginMock} 
      />
    );
    
    const loginButton = screen.getByText('Log In');
    await user.click(loginButton);
    
    expect(onLoginMock).toHaveBeenCalledTimes(1);
  });
});
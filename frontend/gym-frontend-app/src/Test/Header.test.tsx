/* eslint-disable */
// @ts-nocheck
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Input from '../components/common/Input';

describe('Input component', () => {
  const mockRegister = { onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() };
  
  it('renders correctly with label', () => {
    render(
      <Input 
        label="Email" 
        name="email" 
        register={mockRegister} 
      />
    );
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email');
  });

  it('renders with placeholder text', () => {
    render(
      <Input 
        name="username" 
        register={mockRegister} 
        placeholder="Enter your username" 
      />
    );
    
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    const errorMessage = 'This field is required';
    render(
      <Input 
        name="password" 
        register={mockRegister} 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    const input = document.querySelector('input[name="password"]');
    expect(input).toHaveClass('border-red-500');
  });

  it('shows help text when provided and no error', () => {
    const helpText = 'Password must be at least 8 characters';
    render(
      <Input 
        name="password" 
        register={mockRegister} 
        helpText={helpText} 
      />
    );
    
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('prioritizes error message over help text', () => {
    const errorMessage = 'This field is required';
    const helpText = 'Password must be at least 8 characters';
    
    render(
      <Input 
        name="password" 
        register={mockRegister} 
        error={errorMessage}
        helpText={helpText} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(helpText)).not.toBeInTheDocument();
  });

  it('renders with right element when provided', () => {
    render(
      <Input 
        name="search" 
        register={mockRegister} 
        rightElement={<span data-testid="right-element">🔍</span>} 
      />
    );
    
    expect(screen.getByTestId('right-element')).toBeInTheDocument();
    const input = document.querySelector('input[name="search"]');
    expect(input).toHaveClass('pr-11');
  });

  it('applies custom className when provided', () => {
    render(
      <Input 
        name="custom" 
        register={mockRegister} 
        className="test-custom-class" 
      />
    );
    
    const input = document.querySelector('input[name="custom"]');
    expect(input).toHaveClass('test-custom-class');
  });

  it('renders with correct input type', () => {
    render(
      <Input 
        name="password" 
        register={mockRegister} 
        type="password" 
        data-testid="password-input"
      />
    );
    
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('passes additional props to the input element', async () => {
    const onChangeMock = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Input 
        name="test" 
        register={mockRegister} 
        onChange={onChangeMock}
        maxLength={10}
        data-testid="test-input"
      />
    );
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('maxLength', '10');
    
    await user.type(input, 'test');
    expect(onChangeMock).toHaveBeenCalled();
  });
});
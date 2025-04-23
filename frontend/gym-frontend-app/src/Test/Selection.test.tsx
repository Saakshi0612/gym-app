// describe('Basic test setup', () => {
//     it('always passes', () => {
//       expect(true).toBe(true)
//     })
//   })

import { render, screen, fireEvent } from '@testing-library/react';
import DropdownField from '../components/common/Selection';
import { vi } from 'vitest';

describe('DropdownField Component', () => {
  const options = [
    { value: 'option-1', label: 'Option One' },
    { value: 'option-2', label: 'Option Two' },
  ];

  it('renders with label and default value', () => {
    render(
      <DropdownField
        label="Test Label"
        name="test"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Select Test Label');
  });

  it('opens and displays options on click', () => {
    render(
      <DropdownField
        label="Test"
        name="test"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Option One')).toBeInTheDocument();
    expect(screen.getByText('Option Two')).toBeInTheDocument();
  });

  it('calls onChange with selected option', () => {
    const handleChange = vi.fn();

    render(
      <DropdownField
        label="Test"
        name="test"
        options={options}
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option Two'));

    expect(handleChange).toHaveBeenCalledWith('option-2');
  });

  it('shows selected option in button text', () => {
    render(
      <DropdownField
        label="Test"
        name="test"
        options={options}
        value="option-1"
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('option-1');
  });

  it('displays error message when error prop is passed', () => {
    render(
      <DropdownField
        label="Test"
        name="test"
        options={options}
        value=""
        onChange={() => {}}
        error="This is an error"
      />
    );

    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });
});

  
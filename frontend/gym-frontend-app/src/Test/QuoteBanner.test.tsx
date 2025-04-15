// describe('Basic test setup', () => {
//     it('always passes', () => {
//       expect(true).toBe(true)
//     })
//   })

import { render, screen } from '@testing-library/react';
import { QuoteSidebar } from '../components/common/QuoteBanner';
import { describe, it, expect } from 'vitest';

describe('QuoteSidebar Component', () => {
  it('renders the background image', () => {
    render(<QuoteSidebar />);

    const image = screen.getByAltText('Background');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('renders the quote text', () => {
    render(<QuoteSidebar />);

 

    expect(
      screen.getByText(/rise each time you fall/i)
    ).toBeInTheDocument();
  });

  it('renders highlighted text spans', () => {
    render(<QuoteSidebar />);

    const highlights = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        (content.includes('strength to train hard') || content.includes('rise each time you fall'))
      );
    });

    expect(highlights.length).toBe(2);
  });
});

  
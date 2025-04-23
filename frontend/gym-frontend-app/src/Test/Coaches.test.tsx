import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CoachesPage from '../pages/user_pages/Coaches';

// Mock the react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the coachesApi object directly
vi.mock('../assets/JSON/Coaches.json', () => ({
  default: {
    coaches: [
      {
        id: 1,
        name_of_coach: 'John Doe',
        rating: 4.8,
        title: 'Fitness Expert',
        description: 'Experienced coach specializing in strength training.',
        imageUrl: 'https://example.com/john.jpg'
      },
      {
        id: 2,
        name_of_coach: 'Jane Smith',
        rating: 4.5,
        title: 'Yoga Instructor',
        description: 'Specializes in yoga and mindfulness.',
        imageUrl: 'https://example.com/jane.jpg'
      }
    ]
  }
}));

describe('CoachesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading spinner initially', () => {
    render(
      <BrowserRouter>
        <CoachesPage />
      </BrowserRouter>
    );
    
    // Check for the loading spinner div by its class instead of role
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-green-500');
  });

  it('renders coaches after loading', async () => {
    const { container } = render(
      <BrowserRouter>
        <CoachesPage />
      </BrowserRouter>
    );
    
    // Wait for loading to finish and coaches to appear
    await waitFor(() => {
      expect(container.textContent).toContain('John Doe');
    });
    
    // Check if coaches are rendered
    expect(container.textContent).toContain('John Doe');
    expect(container.textContent).toContain('Jane Smith');
    expect(container.textContent).toContain('Fitness Expert');
    expect(container.textContent).toContain('Yoga Instructor');
  });

  it('navigates to coach detail page when a coach card is clicked', async () => {
    const { container } = render(
      <BrowserRouter>
        <CoachesPage />
      </BrowserRouter>
    );
    
    // Wait for loading to finish and coaches to appear
    await waitFor(() => {
      expect(container.textContent).toContain('John Doe');
    });
    
    // Find all buttons in the container
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Click the first button (should be the Book Workout button for the first coach)
    fireEvent.click(buttons[0]);
    
    // Check if navigation occurred with the correct coach ID
    expect(mockNavigate).toHaveBeenCalledWith('/coaches/1');
  });

  it('renders the correct number of coach cards', async () => {
    const { container } = render(
      <BrowserRouter>
        <CoachesPage />
      </BrowserRouter>
    );
    
    // Wait for loading to finish and coaches to appear
    await waitFor(() => {
      expect(container.textContent).toContain('John Doe');
    });
    
    // Count the number of coach cards by finding elements with a more specific selector
    const coachCards = container.querySelectorAll('.grid > .h-full');
    
    // We expect 2 coach cards based on our mock data
    expect(coachCards.length).toBe(2);
  });

  it('displays coach ratings correctly', async () => {
    const { container } = render(
      <BrowserRouter>
        <CoachesPage />
      </BrowserRouter>
    );
    
    // Wait for loading to finish and coaches to appear
    await waitFor(() => {
      expect(container.textContent).toContain('John Doe');
    });
    
    // Check if ratings are displayed correctly
    expect(container.textContent).toContain('4.8');
    expect(container.textContent).toContain('4.5');
  });
});
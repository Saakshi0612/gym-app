export interface FeedbackCardProps {
    name: string;
    date: string;
    rating: number;
    review: string;
    avatarUrl: string;
  }

  export interface Feedback {
    id: number;
    name: string;
    date: string;
    rating: number;
    review: string;
    avatarUrl: string;
  }

  export interface RawFeedback {
    id: string;
    name: string;
    date: string;
    rating: number;
    review: string;
    avatarUrl: string;
  }

  export interface FeedbackState {
    data: Feedback[];
    loading: boolean;
    error: string | null;
  }
// src/services/feedbackService.ts
import { api } from './api';
import { Feedback } from '../types/components/feedback.types';

interface FeedbackResponse {
  message: string;
  data: {
    feedbacks: {
      id: string;
      name: string;
      date: string;
      rating: number;
      review: string;
      avatarUrl: string;
    }[];
    totalPages: number;
    currentPage: number;
  };
}

export const feedbackService = {
  /**
   * Get feedbacks received by the currently logged-in coach
   * @param page Page number
   * @param limit Number of items per page
   * @param sortBy Field to sort by ('rating' or 'date')
   * @returns Promise with feedback data
   */
  async getMyReceivedFeedbacks(
    page: number = 1,
    limit: number = 3,
    sortBy: 'rating' | 'date' = 'rating'
  ): Promise<{ feedbacks: Feedback[]; totalPages: number; currentPage: number }> {
    try {
      const response = await api.get<FeedbackResponse>(
        `/api/feedback/my-received?page=${page}&limit=${limit}&sortBy=${sortBy}`
      );

      // Transform the response data to match our Feedback type
      const transformedFeedbacks = response.data.data.feedbacks.map(feedback => ({
        id: feedback.id,
        name: feedback.name,
        date: feedback.date,
        rating: feedback.rating,
        review: feedback.review || '',
        avatarUrl: feedback.avatarUrl || 'https://via.placeholder.com/150'
      }));

      return {
        feedbacks: transformedFeedbacks,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.currentPage
      };
    } catch (error) {
      console.error('Error fetching received feedbacks:', error);
      throw new Error('Failed to fetch feedbacks. Please try again later.');
    }
  },

  /**
   * Get feedbacks for a specific coach
   * @param coachId ID of the coach
   * @param page Page number
   * @param limit Number of items per page
   * @param sortBy Field to sort by ('rating' or 'date')
   * @returns Promise with feedback data
   */
  async getCoachFeedbacks(
    coachId: string,
    page: number = 1,
    limit: number = 3,
    sortBy: 'rating' | 'date' = 'rating'
  ): Promise<{ feedbacks: Feedback[]; totalPages: number; currentPage: number }> {
    try {
      const response = await api.get<FeedbackResponse>(
        `/api/feedback/coach/${coachId}?page=${page}&limit=${limit}&sortBy=${sortBy}`
      );

      // Transform the response data to match our Feedback type
      const transformedFeedbacks = response.data.data.feedbacks.map(feedback => ({
        id: feedback.id,
        name: feedback.name,
        date: feedback.date,
        rating: feedback.rating,
        review: feedback.review || '',
        avatarUrl: feedback.avatarUrl || 'https://via.placeholder.com/150'
      }));

      return {
        feedbacks: transformedFeedbacks,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.currentPage
      };
    } catch (error) {
      console.error('Error fetching coach feedbacks:', error);
      throw new Error('Failed to fetch feedbacks. Please try again later.');
    }
  },

  /**
   * Get feedbacks given by the currently logged-in user
   * @param page Page number
   * @param limit Number of items per page
   * @param sortBy Field to sort by ('rating' or 'date')
   * @returns Promise with feedback data
   */
  async getMyGivenFeedbacks(
    page: number = 1,
    limit: number = 3,
    sortBy: 'rating' | 'date' = 'rating'
  ): Promise<{ feedbacks: Feedback[]; totalPages: number; currentPage: number }> {
    try {
      const response = await api.get<FeedbackResponse>(
        `/api/feedback/my-given?page=${page}&limit=${limit}&sortBy=${sortBy}`
      );

      // Transform the response data to match our Feedback type
      const transformedFeedbacks = response.data.data.feedbacks.map(feedback => ({
        id: feedback.id,
        name: feedback.name,
        date: feedback.date,
        rating: feedback.rating,
        review: feedback.review || '',
        avatarUrl: feedback.avatarUrl || 'https://via.placeholder.com/150'
      }));

      return {
        feedbacks: transformedFeedbacks,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.currentPage
      };
    } catch (error) {
      console.error('Error fetching given feedbacks:', error);
      throw new Error('Failed to fetch feedbacks. Please try again later.');
    }
  }
};
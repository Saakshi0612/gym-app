// src/utils/feedbackStorage.ts

/**
 * Store information about a workout that has received feedback
 */
export const markWorkoutFeedbackCompleted = (workoutId: string): void => {
  try {
    // Get existing completed feedbacks
    const completedFeedbacks = getCompletedFeedbacks();
    
    // Add the current workout ID if not already present
    if (!completedFeedbacks.includes(workoutId)) {
      completedFeedbacks.push(workoutId);
      
      // Save back to local storage
      localStorage.setItem('completed_feedbacks', JSON.stringify(completedFeedbacks));
    }
  } catch (error) {
    console.error('Error storing feedback completion status:', error);
  }
};

/**
 * Check if a workout has already received feedback
 */
export const hasWorkoutFeedbackCompleted = (workoutId: string): boolean => {
  try {
    const completedFeedbacks = getCompletedFeedbacks();
    return completedFeedbacks.includes(workoutId);
  } catch (error) {
    console.error('Error checking feedback completion status:', error);
    return false;
  }
};

/**
 * Get all workout IDs that have received feedback
 */
export const getCompletedFeedbacks = (): string[] => {
  try {
    const storedData = localStorage.getItem('completed_feedbacks');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error retrieving completed feedbacks:', error);
    return [];
  }
};
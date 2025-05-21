// components/CoachComponents/CoachHeader.tsx
import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { CoachFromApi } from '../../types/components/coach.types';

interface CoachHeaderProps {
  coach: CoachFromApi;
}

const CoachHeader: React.FC<CoachHeaderProps> = ({ coach }) => {
  return (
    <p className="flex items-center space-x-2 p-4">
      <span>Coaches</span>
      <ChevronRightIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-600">{`${coach.firstName} ${coach.lastName}`}</span>
    </p>
  );
};

export default CoachHeader;
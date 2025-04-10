interface CoachDataInterface {
  id: number;
  name_of_coach: string;
  title: string;
  rating: number;
  type_of_sport: string;
  description: string;
  date: string;
  time: string | string[];
  imageUrl?: string;
}

export default CoachDataInterface;

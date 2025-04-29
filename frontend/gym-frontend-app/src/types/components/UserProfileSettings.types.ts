// Enums
export enum UserRole {
  ADMIN = "admin",
  COACH = "coach",
  CLIENT = "client", // changed from "user"
}

export enum Specialization {
  YOGA = "Yoga",
  WEIGHT_TRAINING = "Weight Training",
  CARDIO = "Cardio",
  PILATES = "Pilates",
  CROSSFIT = "CrossFit",
  SWIMMING = "Swimming",
  CYCLING = "Cycling",
  STRENGTH_TRAINING = "Strength Training",
  HIIT = "HIIT",
  BODYBUILDING = "Bodybuilding",
  STRETCHING = "Stretching",
  PERSONAL_WORKOUT = "Personal workout",
  GROUP_WORKOUT = "Group workout",
}

export enum TargetGoal {
  ImproveFlexibility = "Improve flexibility",
  LoseWeight = "Lose weight",
  GainStrength = "Gain strength",
  ImproveEndurance = "Improve endurance",
}

export enum PreferableActivity {
  Yoga = "Yoga",
  Running = "Running",
  WeightLifting = "Weight Lifting",
  Cycling = "Cycling",
}

// Shared Types
export type Certificate = {
  name: string;
  size: string;
  url: string;
};

export type UserProfileData = {
  name: string;
  role: UserRole;
  email: string;
  avatarUrl: string;
  fullName?: string; // Optional full name
};

export type UserProfileHeaderProps = UserProfileData & {
  onFileSelect: (file: File | null) => void;
  rating: number;
};

export type NameFieldsProps = {
  firstName: string;
  lastName: string;
  onChange: (field: string, value: string) => void;
};

export type TitleFieldProps = {
  title: string;
  onChange: (value: string) => void;
};

export type AboutFieldProps = {
  about: string;
  onChange: (value: string) => void;
};

export type TagsFieldProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
};

export type CertificateUploadProps = {
  certificates: Certificate[];
  onDrop: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  onDownload: (url: string) => void;
};

export type TargetGoalSelectProps = {
  selected: string;
  onChange: (value: string) => void;
};

export type PreferableActivitySelectProps = {
  selected: string;
  onChange: (value: string) => void;
};

// Base Profile
type BaseUserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  fullName?: string;
};

// Role-Specific Profiles
export type AdminProfileData = BaseUserProfile & {
  role: UserRole.ADMIN;
  phoneNumber: string;
};

export type CoachProfileData = BaseUserProfile & {
  role: UserRole.COACH;
  rating: number;
  title: string;
  about: string;
  tags: string[];
  certificates: Certificate[];
};

export interface ClientProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferableActivity: PreferableActivity;
  target: TargetGoal;
  profileImage?: string;
}

// Unified Mock Data Structure
export type UserProfileMockData = {
  [UserRole.ADMIN]: AdminProfileData;
  [UserRole.COACH]: CoachProfileData;
  [UserRole.CLIENT]: ClientProfileData;
};

export interface UnifiedUserProfileFormProps {
  role: UserRole;
  profileData: AdminProfileData | CoachProfileData | ClientProfileData;
}

// ✅ Renamed type
export type UserProfileFormState = {
  userData: UserProfileData | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  title: string;
  about: string;
  tags: string[];
  certificates: Certificate[];
  rating: number;
  preferableActivity: string;
  targets: string;
  showSuccess: boolean;
  saving: boolean;
};

export interface SaveButtonProps {
  saving: boolean;
  onClick: () => void;
}

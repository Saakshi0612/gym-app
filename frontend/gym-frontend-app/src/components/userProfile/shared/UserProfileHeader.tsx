import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserProfileHeaderProps,UserRole } from "../../../types/components/UserProfileSettings.types";


const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  name,
  role,
  email,
  avatarUrl,
  onFileSelect,
  rating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
  };

  const showAvatar = role === UserRole.COACH || role === UserRole.CLIENT;
  const showRating = role === UserRole.COACH;

  if (!name || !email) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-4 pt-3 pb-4 w-full bg-primary-white rounded-lg">
      {/* Avatar Upload */}
      {showAvatar && (
        <div className="relative w-20 h-20 min-w-[5rem] min-h-[5rem]">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-neutral-300"
          />
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-primary-white border border-neutral-300 rounded-full p-0.5 hover:bg-neutral-200 cursor-pointer"
          >
            <Camera size={16} className="text-neutral-700" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Info & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold">
              {name} <span className="text-sm text-neutral-500">({role})</span>
            </h2>
            {showRating && (
              <div className="flex items-center gap-1 text-sm text-neutral-600">
                <span className="font-medium">Rating</span>
                <span className="font-semibold">{rating.toFixed(2)}</span>
                <StarIcon className="w-4 h-4 text-semantic-yellow" />
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-600">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;

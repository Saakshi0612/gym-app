import React, { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserProfileHeaderProps, UserRole } from "../../../types/components/UserProfileSettings.types";
import { validateFileType } from "../../../utils/validation";
import ImageCropper from "./ImageCropper";
import SuccessAlert from "./SuccessAlert";

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  name,
  role,
  email,
  avatarUrl,
  onFileSelect,
  rating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEditClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type first
      const typeError = validateFileType(file);
      if (typeError) {
        setError(typeError);
        return;
      }
      
      // For larger files, show the cropper instead of showing an error
      if (file.size > 2 * 1024 * 1024) {
        setSelectedFile(file);
        setShowCropper(true);
        return;
      }
      
      // If validation passes, proceed with file selection
      onFileSelect(file);
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Create a new file from the cropped blob
    const croppedFile = new File([croppedImageBlob], selectedFile?.name || 'cropped-image.jpg', {
      type: 'image/jpeg',
    });
    
    // Pass the cropped file to the parent component
    onFileSelect(croppedFile);
    setSuccess("Profile picture updated successfully!");
    setShowCropper(false);
    setSelectedFile(null);

    setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
  };

  const showAvatar = role === UserRole.COACH || role === UserRole.CLIENT;
  const showRating = role === UserRole.COACH;

  if (!name || !email) return null;

  return (
    <div className="relative">
      {error && (
        <div className="mb-4">
          <SuccessAlert
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <SuccessAlert
            message={success}
            onClose={() => setSuccess(null)}
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-4 pt-3 pb-4 w-full bg-primary-white rounded-lg">
        {/* Avatar Upload */}
        {showAvatar && (
          <div className="relative w-20 h-20 min-w-[5rem] min-h-[5rem]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border border-neutral-400"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200 rounded-full border border-neutral-400">
                <User size={32} className="text-neutral-600" />
              </div>
            )}
            <button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 bg-primary-white border border-neutral-400 rounded-full p-0.5 hover:bg-neutral-200 cursor-pointer"
            >
              <Camera size={16} className="text-neutral-700" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Info & Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-base font-semibold text-primary-black">
                {name} <span className="text-sm text-neutral-600">({role})</span>
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

        {/* Image Cropper Modal */}
        {showCropper && selectedFile && (
          <ImageCropper
            imageFile={selectedFile}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={1}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;

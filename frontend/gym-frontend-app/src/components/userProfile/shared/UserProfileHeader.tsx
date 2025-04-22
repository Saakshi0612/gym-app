import React, { useRef, useState, useCallback } from "react";
import { Camera, User } from "lucide-react";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserProfileHeaderProps, UserRole } from "../../../types/components/UserProfileSettings.types";
import { validateFileType } from "../../../utils/validation";
import ImageCropper from "./ImageCropper";
import SuccessAlert from "./SuccessAlert";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleEditClick = () => {
    clearMessages();
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    const typeError = validateFileType(file);
    if (typeError) {
      setError(typeError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Show cropper for all images
    setSelectedFile(file);
    setShowCropper(true);
  };

  const handleCropComplete = useCallback((croppedImageBlob: Blob) => {
    try {
      // Create a new file from the cropped blob
      const croppedFile = new File([croppedImageBlob], selectedFile?.name || 'profile-image.jpg', {
        type: 'image/jpeg',
      });
      
      // Pass the cropped file to the parent component
      onFileSelect(croppedFile);
      setSuccess("Profile picture updated successfully!");
      
      // Reset states
      setShowCropper(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear success message after 8 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 8000);
    } catch (error) {
      console.error('Error processing cropped image:', error);
      setError("Failed to process the image. Please try again.");
      setShowCropper(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedFile, onFileSelect]);

  const handleCropCancel = useCallback(() => {
    setShowCropper(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const showAvatar = role === UserRole.COACH || role === UserRole.CLIENT;
  const showRating = role === UserRole.COACH;

  if (!name || !email) return null;

  return (
    <div className="relative">
      {(error || success) && (
        <div className="mb-4">
          <SuccessAlert
            type={error ? "error" : "success"}
            message={error || success}
            onClose={clearMessages}
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
                alt={`${name}'s profile`}
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
              aria-label="Edit profile picture"
            >
              <Camera size={16} className="text-neutral-700" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload profile picture"
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
                  <span className="font-semibold">{rating?.toFixed(2) || '0.00'}</span>
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

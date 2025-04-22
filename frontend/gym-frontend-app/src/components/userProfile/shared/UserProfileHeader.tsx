import React, { useRef, useState } from "react";
import { Camera, User, Star as StarIcon, CheckCircle } from "lucide-react";
import { UserProfileHeaderProps, UserRole } from "../../../types/components/UserProfileSettings.types";
import { validateFileType } from "../../../utils/validation";
import ImageCropper from "./ImageCropper";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const avatarVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2
    }
  }
};

const infoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3
    }
  }
};

const ratingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4
    }
  }
};

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the input value to ensure onChange fires even if the same file is selected
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type first
      const typeError = validateFileType(file);
      if (!typeError) {
        // Always show the cropper for image selection
        setSelectedFile(file);
        setShowCropper(true);
      }
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Create a new file from the cropped blob
    const croppedFile = new File([croppedImageBlob], selectedFile?.name || 'cropped-image.jpg', {
      type: 'image/jpeg',
    });
    
    // Pass the cropped file to the parent component
    onFileSelect(croppedFile);
    setShowCropper(false);
    setSelectedFile(null);
    
    // Show success notification
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
  };

  const showAvatar = role === UserRole.COACH || role === UserRole.CLIENT;
  const showRating = role === UserRole.COACH && rating > 0;

  if (!name || !email) return null;

  return (
    <motion.div 
      className="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-4 pt-3 pb-4 w-full bg-primary-white rounded-lg">
        {/* Avatar Upload */}
        {showAvatar && (
          <motion.div 
            className="relative w-20 h-20 min-w-[5rem] min-h-[5rem]"
            variants={avatarVariants}
          >
            {avatarUrl ? (
              <motion.img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border border-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div 
                className="w-full h-full flex items-center justify-center bg-neutral-200 rounded-full border border-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <User size={32} className="text-neutral-600" />
              </motion.div>
            )}
            <motion.button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 bg-primary-white border border-neutral-400 rounded-full p-0.5 hover:bg-neutral-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera size={16} className="text-neutral-700" />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        )}

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 right-0 bg-primary-green text-primary-black px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2 z-10"
            >
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Profile photo updated!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info & Rating */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2"
          variants={infoVariants}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <motion.h2 
                className="text-base font-semibold text-primary-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {name} <span className="text-sm text-neutral-600">({role.charAt(0).toUpperCase() + role.slice(1)})</span>
              </motion.h2>
              {showRating && (
                <motion.div 
                  className="flex items-center gap-1 text-sm text-neutral-600"
                  variants={ratingVariants}
                >
                  <span className="font-medium">Rating</span>
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <StarIcon className="w-4 h-4 text-semantic-yellow" />
                  </motion.div>
                </motion.div>
              )}
            </div>
            <motion.p 
              className="text-sm text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {email}
            </motion.p>
          </div>
        </motion.div>

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
    </motion.div>
  );
};

export default UserProfileHeader;

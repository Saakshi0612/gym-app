import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  UserRole,
  UserProfileData,
  Certificate,
  AdminProfileData,
  CoachProfileData,
  ClientProfileData,
  UserProfileFormState,
} from "../../types/components/UserProfileSettings.types";
import { AppDispatch } from "../../store/store";
import { AnyAction } from "redux";
import { motion, AnimatePresence } from "framer-motion";

import UserProfileHeader from "./shared/UserProfileHeader";
import TagsField from "./TagsField";
import CertificateUpload from "./CertificateUpload";
import ProfileSaveButton from "./shared/ProfileSaveButton";
import SuccessAlert from "./shared/SuccessAlert";
import LabeledInput from "./shared/LabeledInput";
import DynamicSelect from "./DynamicSelect";

import options from "../../assets/JSON/DropdownSelect.json";
import { updateUserProfile } from "../../services/authSlice";
import { User } from "../../types/auth.types";
import { validateName } from '../../utils/validation';

interface UserProfileFormProps {
  role: UserRole;
  profileData: AdminProfileData | CoachProfileData | ClientProfileData;
  onChange: (newData: AdminProfileData | CoachProfileData | ClientProfileData) => void;
  onSaveSuccess: () => void;
  lastSaved: Date | null;
}

// Animation variants for smoother transitions
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2
    }
  }
};

const formFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3 + i * 0.1
    }
  })
};

const alertVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    y: -50, opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  role,
  profileData,
  onChange,
  onSaveSuccess,
  lastSaved,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const initialFormStateRef = useRef<UserProfileFormState | null>(null);

  const [formState, setFormState] = useState<UserProfileFormState>({
    userData: null,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    title: "",
    about: "",
    tags: [],
    certificates: [],
    rating: 0,
    preferableActivity: "",
    targets: "",
    showSuccess: false,
    saving: false,
    error: null,
  });

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Reset form state when profile data changes
    const userData: UserProfileData = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      role: profileData.role,
      avatarUrl: profileData.avatarUrl,
    };

    const newFormState: UserProfileFormState = {
      userData,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber:
        role === UserRole.ADMIN && "phoneNumber" in profileData
          ? profileData.phoneNumber
          : "",
      title: role === UserRole.COACH ? (profileData as CoachProfileData).title : "",
      about: role === UserRole.COACH ? (profileData as CoachProfileData).about : "",
      tags: role === UserRole.COACH ? (profileData as CoachProfileData).tags : [],
      certificates:
        role === UserRole.COACH ? (profileData as CoachProfileData).certificates : [],
      rating: role === UserRole.COACH ? (profileData as CoachProfileData).rating : 0,
      preferableActivity:
        role === UserRole.CLIENT ? (profileData as ClientProfileData).preferableActivity : "",
      targets:
        role === UserRole.CLIENT ? (profileData as ClientProfileData).targets : "",
      showSuccess: false,
      saving: false,
      error: null,
    };

    // Only update if the data has actually changed
    if (JSON.stringify(newFormState) !== JSON.stringify(formState)) {
      setFormState(newFormState);
      initialFormStateRef.current = newFormState;
      setIsDirty(false);
    }
  }, [role, profileData, formState]);

  // Check if form has been modified
  useEffect(() => {
    if (!initialFormStateRef.current) return;
    
    const hasChanges = 
      formState.firstName !== initialFormStateRef.current.firstName ||
      formState.lastName !== initialFormStateRef.current.lastName ||
      formState.phoneNumber !== initialFormStateRef.current.phoneNumber ||
      formState.title !== initialFormStateRef.current.title ||
      formState.about !== initialFormStateRef.current.about ||
      formState.preferableActivity !== initialFormStateRef.current.preferableActivity ||
      formState.targets !== initialFormStateRef.current.targets ||
      JSON.stringify(formState.tags) !== JSON.stringify(initialFormStateRef.current.tags) ||
      JSON.stringify(formState.certificates) !== JSON.stringify(initialFormStateRef.current.certificates);
    
    setIsDirty(hasChanges);
  }, [formState]);

  const handleDrop = (files: File[]) => {
    const newCerts: Certificate[] = files.map((file) => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file),
    }));

    setFormState((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ...newCerts],
    }));
  };

  const handleRemove = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const handleProfilePhotoChange = (file: File | null) => {
    if (file) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Update the form state with the new image URL and mark as dirty
      setFormState((prev) => ({
        ...prev,
        userData: prev.userData ? {
          ...prev.userData,
          avatarUrl: imageUrl
        } : null,
        isDirty: true
      }));

      // Trigger the onChange callback with the updated profile data
      const updatedProfileData = {
        ...profileData,
        avatarUrl: imageUrl
      };
      onChange(updatedProfileData);
      
      // Clean up the old URL if it exists
      if (formState.userData?.avatarUrl) {
        URL.revokeObjectURL(formState.userData.avatarUrl);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validate first name before saving
      const firstNameError = validateName(formState.firstName);
      if (firstNameError) {
        setFormState(prev => ({ ...prev, error: firstNameError }));
        return;
      }

      // Validate last name before saving
      const lastNameError = validateName(formState.lastName);
      if (lastNameError) {
        setFormState(prev => ({ ...prev, error: lastNameError }));
        return;
      }

      setFormState((prev) => ({ ...prev, saving: true }));

      await new Promise((res) => setTimeout(res, 600));

      const updatedUserData = formState.userData
        ? {
            ...formState.userData,
            name: `${formState.firstName} ${formState.lastName}`,
          }
        : null;

      const updatedFormState: UserProfileFormState = {
        ...formState,
        saving: false,
        showSuccess: true,
        userData: updatedUserData,
      };

      setFormState(updatedFormState);
      initialFormStateRef.current = updatedFormState;
      setIsDirty(false);

      const userPayload: User = {
        email: formState.userData?.email || "",
        firstName: formState.firstName,
        lastName: formState.lastName,
        role: formState.userData?.role || UserRole.CLIENT,
        phoneNumber: formState.phoneNumber,
        title: formState.title,
        about: formState.about,
        tags: formState.tags,
        certificates: formState.certificates,
        rating: formState.rating,
        preferableActivity: formState.preferableActivity,
        target: formState.targets,
        avatarUrl: formState.userData?.avatarUrl || "",
      };

      // Dispatch with proper type assertion
      dispatch(updateUserProfile(userPayload) as unknown as AnyAction);

      setTimeout(() => {
        setFormState((prev) => ({ ...prev, showSuccess: false }));
      }, 4000);

      console.log("✅ Data saved:", updatedFormState);

      // Call the onChange prop to notify parent component of changes
      if (onChange) {
        const updatedProfileData = {
          ...profileData,
          firstName: formState.firstName,
          lastName: formState.lastName,
          phoneNumber: formState.phoneNumber,
          title: formState.title,
          about: formState.about,
          tags: formState.tags,
          certificates: formState.certificates,
          rating: formState.rating,
          preferableActivity: formState.preferableActivity,
          targets: formState.targets,
          avatarUrl: formState.userData?.avatarUrl || "",
        };
        onChange(updatedProfileData);
      }

      // Log the last saved time if available
      if (lastSaved) {
        console.log("Last saved:", lastSaved.toLocaleString());
      }

      onSaveSuccess();
    } catch (err) {
      console.error("Error saving profile:", err);
      setFormState(prev => ({ ...prev, error: "Error saving changes." }));
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  };

  if (!formState.userData)
    return <div className="p-4 text-center">Loading profile...</div>;

  return (
    <>
      <AnimatePresence>
        {formState.showSuccess && (
          <motion.div 
            className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SuccessAlert
              message="Your profile has been updated successfully."
              onClose={() =>
                setFormState((prev) => ({ ...prev, showSuccess: false }))
              }
            />
          </motion.div>
        )}
        {formState.error && (
          <motion.div 
            className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SuccessAlert
              message={formState.error}
              onClose={() =>
                setFormState((prev) => ({ ...prev, error: null }))
              }
              type="error"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 w-full bg-primary-white rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <UserProfileHeader
            {...formState.userData}
            onFileSelect={handleProfilePhotoChange}
            rating={formState.rating}
          />
        </motion.div>

        <motion.div 
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={formFieldVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <LabeledInput
            id="firstName"
            label="First Name"
            value={formState.firstName}
            placeholder="e.g. Jenson"
            onChange={(val) =>
              setFormState((prev) => ({ ...prev, firstName: val }))
            }
            validation={validateName}
          />
          <LabeledInput
            id="lastName"
            label="Last Name"
            value={formState.lastName}
            placeholder="e.g. Button"
            onChange={(val) =>
              setFormState((prev) => ({ ...prev, lastName: val }))
            }
            validation={validateName}
          />
        </motion.div>

        {role === UserRole.ADMIN && (
          <motion.div 
            className="mt-6"
            variants={formFieldVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          >
            <LabeledInput
              id="phoneNumber"
              label="Phone Number"
              value={formState.phoneNumber}
              placeholder="e.g. +1 234 567 8901"
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, phoneNumber: val }))
              }
            />
          </motion.div>
        )}

        {role === UserRole.COACH && (
          <>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <LabeledInput
                id="title"
                label="Title"
                value={formState.title}
                placeholder="e.g. Certified Fitness Coach"
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, title: val }))
                }
                showPlaceholderAsHint={true}
              />
            </motion.div>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <LabeledInput
                id="about"
                label="About"
                value={formState.about}
                placeholder="e.g. Passionate about helping people reach their fitness goals..."
                type="textarea"
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, about: val }))
                }
                showPlaceholderAsHint={true}
              />
            </motion.div>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={3}
              initial="hidden"
              animate="visible"
            >
              <TagsField
                tags={formState.tags}
                onAddTag={(tag) =>
                  setFormState((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tag],
                  }))
                }
                onRemoveTag={(index) =>
                  setFormState((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((_, i) => i !== index),
                  }))
                }
              />
            </motion.div>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={4}
              initial="hidden"
              animate="visible"
            >
              <CertificateUpload
                certificates={formState.certificates}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onDownload={(url) => window.open(url, "_blank")}
              />
            </motion.div>
          </>
        )}

        {role === UserRole.CLIENT && (
          <>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <DynamicSelect
                id="target-goals"
                label="Target Goals"
                options={options.targetOptions}
                selected={formState.targets}
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, targets: val }))
                }
              />
            </motion.div>
            <motion.div 
              className="mt-6"
              variants={formFieldVariants}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <DynamicSelect
                id="preferred-activity"
                label="Preferred Activity"
                options={options.activityOptions}
                selected={formState.preferableActivity}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    preferableActivity: val,
                  }))
                }
              />
            </motion.div>
          </>
        )}

        <motion.div 
          className="mt-8"
          variants={formFieldVariants}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <ProfileSaveButton 
            saving={formState.saving} 
            onClick={handleSave} 
            disabled={!isDirty}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default UserProfileForm;

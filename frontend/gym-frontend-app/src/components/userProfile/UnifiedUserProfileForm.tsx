import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux"; // import useDispatch
import {
  UserRole,
  UserProfileData,
  Certificate,
  AdminProfileData,
  CoachProfileData,
  ClientProfileData,
  UserProfileFormState,
} from "../../types/components/UserProfileSettings.types";

import UserProfileHeader from "./shared/UserProfileHeader";
import TagsField from "./TagsField";
import CertificateUpload from "./CertificateUpload";
import ProfileSaveButton from "./shared/ProfileSaveButton";
import SuccessAlert from "./shared/SuccessAlert";
import LabeledInput from "./shared/LabeledInput";
import DynamicSelect from "./DynamicSelect";
import { toast } from "sonner";

import options from "../../assets/JSON/DropdownSelect.json";
import { updateUserProfile } from "../../services/authSlice";

interface UnifiedUserProfileFormProps {
  role: UserRole;
  profileData: AdminProfileData | CoachProfileData | ClientProfileData;
}

const UnifiedUserProfileForm: React.FC<UnifiedUserProfileFormProps> = ({
  role,
  profileData,
}) => {
  const dispatch = useDispatch(); // Initialize dispatch to update Redux state

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
    targets: "",  // Changed from targetGoal to targets
    showSuccess: false,
    saving: false,
  });

  useEffect(() => {
    const savedFormState = localStorage.getItem("userProfileFormState");
    if (savedFormState) {
      setFormState(JSON.parse(savedFormState));
    } else {
      const userData: UserProfileData = {
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        role: profileData.role,
        avatarUrl: profileData.avatarUrl,
      };

      setFormState((prev) => ({
        ...prev,
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
        targets: // Changed from targetGoal to targets
          role === UserRole.CLIENT ? (profileData as ClientProfileData).targets : "", 
      }));
    }
  }, [role, profileData]);

  const handleDrop = (files: FileList | null) => {
    if (!files) return;
    const newCerts: Certificate[] = Array.from(files).map((file) => ({
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

  const handleSave = async () => {
    try {
      setFormState((prev) => ({ ...prev, saving: true }));

      await new Promise((res) => setTimeout(res, 600)); // Simulate API

      toast.success("Changes saved!");

      setFormState((prev) => ({
        ...prev,
        saving: false,
        showSuccess: true,
        userData: prev.userData
          ? {
              ...prev.userData,
              name: `${prev.firstName} ${prev.lastName}`,
            }
          : null,
      }));

      // Save form state to localStorage after successful save
      localStorage.setItem("userProfileFormState", JSON.stringify(formState));

      // Dispatch the updated formState to Redux to update the global state
      const userPayload = {
        email: formState.userData?.email || "",
        role: formState.userData?.role || UserRole.CLIENT,
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
      };
      dispatch(updateUserProfile(userPayload));

      setTimeout(() => {
        setFormState((prev) => ({ ...prev, showSuccess: false }));
      }, 4000);

      console.log("🔄 Data saved:", { ...formState });
    } catch {
      toast.error("Error saving changes.");
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  };

  if (!formState.userData)
    return <div className="p-4 text-center">Loading profile...</div>;

  return (
    <>
      {formState.showSuccess && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
          <SuccessAlert
            message="Your profile has been updated successfully."
            onClose={() =>
              setFormState((prev) => ({ ...prev, showSuccess: false }))
            }
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 w-full">
        <UserProfileHeader
          {...formState.userData}
          onFileSelect={(file) => console.log("Selected file:", file)}
          rating={role === UserRole.COACH ? formState.rating : 0}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput
            id="firstName"
            label="First Name"
            value={formState.firstName}
            placeholder="e.g. Jenson"
            onChange={(val) =>
              setFormState((prev) => ({ ...prev, firstName: val }))
            }
          />
          <LabeledInput
            id="lastName"
            label="Last Name"
            value={formState.lastName}
            placeholder="e.g. Button"
            onChange={(val) =>
              setFormState((prev) => ({ ...prev, lastName: val }))
            }
          />
        </div>

        {role === UserRole.ADMIN && (
          <div className="mt-6">
            <LabeledInput
              id="phoneNumber"
              label="Phone Number"
              value={formState.phoneNumber}
              placeholder="e.g. +1 234 567 8901"
              onChange={(val) =>
                setFormState((prev) => ({ ...prev, phoneNumber: val }))
              }
            />
          </div>
        )}

        {role === UserRole.COACH && (
          <>
            <div className="mt-6">
              <LabeledInput
                id="title"
                label="Title"
                value={formState.title}
                placeholder="e.g. Certified Fitness Coach"
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, title: val }))
                }
              />
            </div>
            <div className="mt-6">
              <LabeledInput
                id="about"
                label="About"
                value={formState.about}
                placeholder="e.g. Passionate about helping people reach their fitness goals..."
                type="textarea"
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, about: val }))
                }
              />
            </div>
            <div className="mt-6">
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
            </div>
            <div className="mt-6">
              <CertificateUpload
                certificates={formState.certificates}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onDownload={(url) => window.open(url, "_blank")}
              />
            </div>
          </>
        )}

        {role === UserRole.CLIENT && (
          <>
            <div className="mt-6">
              <DynamicSelect
                label="Preferable Activity"
                placeholder="Select Activity"
                options={options.activityOptions}
                selected={formState.preferableActivity}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    preferableActivity: val,
                  }))
                }
              />
            </div>
            <div className="mt-6">
              <DynamicSelect
                label="Target Goals" // Updated to "Target Goals"
                placeholder="Select Goal"
                options={options.targetOptions} // Ensure this matches the new options data
                selected={formState.targets} // Updated to match "targets"
                onChange={(val) =>
                  setFormState((prev) => ({ ...prev, targets: val })) // Updated to match "targets"
                }
              />
            </div>
          </>
        )}

        <div className="mt-8">
          <ProfileSaveButton saving={formState.saving} onClick={handleSave} />
        </div>
      </div>
    </>
  );
};

export default UnifiedUserProfileForm;

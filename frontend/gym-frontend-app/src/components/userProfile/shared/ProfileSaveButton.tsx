import React from "react";

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  saving?: boolean;
}

const ProfileSaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled = false,
  saving = false,
}) => {
  return (
    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || saving}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
          disabled || saving
            ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
            : "bg-primary-green text-primary-black hover:bg-[#9ef300] hover:text-primary-white"
        }`}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ProfileSaveButton;

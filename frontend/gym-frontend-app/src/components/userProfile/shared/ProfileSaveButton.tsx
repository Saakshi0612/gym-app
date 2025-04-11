import React from "react";

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ProfileSaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        className="rounded-md bg-[var(--color-primary-green)] px-7 py-2.5 text-base font-medium text-[var(--color-primary-black)] transition-all duration-200 hover:bg-[var(--color-green-200)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileSaveButton;

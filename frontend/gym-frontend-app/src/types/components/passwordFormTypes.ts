export type VisibilityType = {
  old: boolean;
  new: boolean;
  confirm: boolean;
};

export type FormDataType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TouchedType = {
  old: boolean;
  new: boolean;
  confirm: boolean;
};

export type UserData = {
  user?: {
    currentPassword: string;
  };
};


export type PasswordFormProps = {
  user: {
    currentPassword: string;
  };
};



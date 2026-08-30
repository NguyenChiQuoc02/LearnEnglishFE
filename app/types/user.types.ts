export type TeacherResponse = {
  id: number;
  username: string;
  email: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  avatarUrl: string | null;
  roles: string[];
};

export type UserRequest = {
  username: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  roles: string[];
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

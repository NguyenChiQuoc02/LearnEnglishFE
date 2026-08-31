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
  provinceCode: string | null;
  provinceName: string | null;
  wardCode: string | null;
  wardName: string | null;
  roles: string[];
};

export type UserRequest = {
  username: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  provinceCode?: string;
  wardCode?: string;
  roles: string[];
};

export type ProfileUpdateRequest = {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  provinceCode?: string;
  wardCode?: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type UserImportRowResult = {
  rowNumber: number;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  role: string | null;
  valid: boolean;
  error: string | null;
};

export type UserImportResponse = {
  rows: UserImportRowResult[];
  successCount: number;
  failureCount: number;
};

export type BulkDeleteResult = {
  id: number;
  username: string | null;
  success: boolean;
  error: string | null;
};

export type BulkDeleteResponse = {
  results: BulkDeleteResult[];
  successCount: number;
  failureCount: number;
};

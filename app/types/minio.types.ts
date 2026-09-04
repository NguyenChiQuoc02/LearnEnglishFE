export type MinioFileResponse = {
  objectName: string;
  originalFilename: string;
  url: string;
  size: number;
  contentType: string | null;
  uploadedAt: string;
};

export type MinioUploadResult = {
  filename: string;
  success: boolean;
  file: MinioFileResponse | null;
  error: string | null;
};

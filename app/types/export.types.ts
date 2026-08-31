export type ExportFormat = "EXCEL" | "WORD" | "PDF";

export type ExportRequest = {
  format: ExportFormat;
  role?: string;
  keyword?: string;
};

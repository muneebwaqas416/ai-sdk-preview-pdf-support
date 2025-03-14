import { z } from 'zod';

export const fileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  uploadedAt: z.date(),
});

export type FileItem = z.infer<typeof fileSchema>;

export interface FileContextState {
  files: FileItem[];
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export interface FileContextValue extends FileContextState {
  uploadFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  validateFile: (file: File) => boolean;
}

export interface FileUploadProps {
  onUploadComplete?: (files: FileItem[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  children?: React.ReactNode;
}
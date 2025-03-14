'use client';

import React, { useCallback } from 'react';
import { FileUploadProps } from '@/app/types/file-types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, X, Loader2 } from 'lucide-react';
import { useFiles } from '@/app/context/FileContext';

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
}: FileUploadProps) {
  const { files, isUploading, error, progress, uploadFiles, removeFile, clearFiles } = useFiles();

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      
      if (selectedFiles.length + files.length > maxFiles) {
        onUploadError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      await uploadFiles(selectedFiles);

      if (error) {
        onUploadError?.(error);
      } else {
        onUploadComplete?.(files);
      }
    },
    [files, maxFiles, uploadFiles, error, onUploadComplete, onUploadError]
  );

  return (
    <div className="w-full space-y-4">
      <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50">
        <input
          type="file"
          onChange={handleFileChange}
          accept={acceptedTypes.join(',')}
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          {isUploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            'Drop files here or click to browse'
          )}
        </p>
      </div>

      {isUploading && (
        <div className="w-full space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">{progress}%</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFiles}
            disabled={isUploading}
            className="w-full mt-2"
          >
            Clear All Files
          </Button>
        </div>
      )}
    </div>
  );
}
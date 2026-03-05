'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

export function FileUploader({ onFileSelect, accept, disabled }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    if (fileRejections.length > 0) {
      toast({
        variant: 'destructive',
        title: `${fileRejections.length} files rejected`,
        description: 'Please upload supported image files (PNG, JPG, or WEBP). You can upload up to 20 files.',
      })
    }
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
    setIsDragActive(false);
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: accept || { 'image/*': ['.jpeg', '.png', '.webp', '.jpg'] },
    multiple: true,
    maxFiles: 20,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors",
        isDragActive ? "border-primary" : "border-border",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadCloud className={cn("w-10 h-10 mb-3 text-muted-foreground", isDragActive && "text-primary")} />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max 20 files)</p>
      </div>
    </div>
  );
}

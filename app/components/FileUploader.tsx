import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  file: File | null;
}

const FileUploader = ({ onFileSelect, file }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;

      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div
      {...getRootProps({
        className: "w-full gradient-border uploader-dropzone",
      })}
    >
      <input {...getInputProps({ id: "uploader" })} />

      <div className="space-y-4">
        {file ? (
          <div
            className="uploader-selected-file"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/images/pdf.png"
              alt="pdf"
              className="size-10 select-none"
              draggable={false}
            />
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect?.(null);
              }}
            >
              <img
                src="/icons/cross.svg"
                alt="remove"
                className="w-4 h-4 select-none"
                draggable={false}
              />
            </button>
          </div>
        ) : (
          <div className="select-none pointer-events-none">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <img
                src="/icons/info.svg"
                alt="upload"
                className="size-20 select-none"
                draggable={false}
              />
            </div>
            <p className="text-lg text-gray-500 select-none">
              <span className="font-semibold">Click to upload</span> or drag
              and drop
            </p>
            <p className="text-lg text-gray-500 select-none">
              PDF (max {formatSize(maxFileSize)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FileUploader;

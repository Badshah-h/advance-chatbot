import React, { useState, useRef } from "react";
import { Paperclip, X, FileText, Image, File } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DocumentUploadProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  language?: "en" | "ar";
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  maxSizeMB = 5,
  acceptedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ],
  language = "en",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError("File type not supported. Please upload PDF or image files.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5" />;
    if (fileType.includes("image")) return <Image className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(",")}
        className="hidden"
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleButtonClick}
              className="text-gray-500 hover:text-primary hover:bg-gray-100"
            >
              <Paperclip size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "en" ? "Upload document" : "تحميل مستند"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {error && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-50 text-red-600 text-xs p-2 rounded-md border border-red-200">
          {error}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1 text-red-500"
            onClick={() => setError(null)}
          >
            <X size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

import React, { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";

export default {
  title: "Components/DocumentUpload",
  component: DocumentUpload,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    const fileSizeKB = file.size / 1024;
    const fileSizeMB = fileSizeKB / 1024;
    const fileSize =
      fileSizeMB >= 1
        ? `${fileSizeMB.toFixed(2)} MB`
        : `${fileSizeKB.toFixed(2)} KB`;

    setFileInfo({
      name: file.name,
      size: fileSize,
    });
  };

  return (
    <div className="p-4 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <DocumentUpload onFileSelect={handleFileSelect} />
        <span className="text-sm text-gray-500">
          Click to upload a document
        </span>
      </div>

      {fileInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-medium">Selected File:</p>
          <p>Name: {fileInfo.name}</p>
          <p>Size: {fileInfo.size}</p>
        </div>
      )}
    </div>
  );
};

export const WithSizeLimit = () => {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    const fileSizeKB = file.size / 1024;
    const fileSizeMB = fileSizeKB / 1024;
    const fileSize =
      fileSizeMB >= 1
        ? `${fileSizeMB.toFixed(2)} MB`
        : `${fileSizeKB.toFixed(2)} KB`;

    setFileInfo({
      name: file.name,
      size: fileSize,
    });
  };

  return (
    <div className="p-4 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <DocumentUpload onFileSelect={handleFileSelect} maxSizeMB={2} />
        <span className="text-sm text-gray-500">Max file size: 2MB</span>
      </div>

      {fileInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-medium">Selected File:</p>
          <p>Name: {fileInfo.name}</p>
          <p>Size: {fileInfo.size}</p>
        </div>
      )}
    </div>
  );
};

export const ArabicLanguage = () => {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    const fileSizeKB = file.size / 1024;
    const fileSizeMB = fileSizeKB / 1024;
    const fileSize =
      fileSizeMB >= 1
        ? `${fileSizeMB.toFixed(2)} MB`
        : `${fileSizeKB.toFixed(2)} KB`;

    setFileInfo({
      name: file.name,
      size: fileSize,
    });
  };

  return (
    <div className="p-4 max-w-md" dir="rtl">
      <div className="flex items-center gap-2 mb-4">
        <DocumentUpload onFileSelect={handleFileSelect} language="ar" />
        <span className="text-sm text-gray-500">انقر لتحميل مستند</span>
      </div>

      {fileInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-medium">الملف المحدد:</p>
          <p>الاسم: {fileInfo.name}</p>
          <p>الحجم: {fileInfo.size}</p>
        </div>
      )}
    </div>
  );
};

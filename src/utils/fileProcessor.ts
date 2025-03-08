/**
 * Utility functions for processing uploaded files
 */

// Function to extract text from an image using OCR
// In a real app, this would use a proper OCR service like Tesseract.js or a backend API
export async function extractTextFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Simulate OCR processing with a delay
    setTimeout(() => {
      // Mock OCR result based on file name
      const fileName = file.name.toLowerCase();
      let extractedText = "";

      if (fileName.includes("id") || fileName.includes("emirates")) {
        extractedText =
          "Emirates ID document detected. This appears to be an identity document with personal information.";
      } else if (fileName.includes("visa") || fileName.includes("passport")) {
        extractedText =
          "Visa/Passport document detected. This appears to be a travel or residence document.";
      } else if (
        fileName.includes("license") ||
        fileName.includes("business")
      ) {
        extractedText =
          "Business license document detected. This appears to be a commercial registration document.";
      } else if (fileName.includes("vehicle") || fileName.includes("car")) {
        extractedText =
          "Vehicle registration document detected. This appears to be related to a motor vehicle.";
      } else {
        extractedText =
          "Document detected. I can see some text but cannot determine the specific document type.";
      }

      resolve(extractedText);
    }, 1500);
  });
}

// Function to extract text from a PDF
// In a real app, this would use a PDF parsing library like pdf.js
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Simulate PDF processing with a delay
    setTimeout(() => {
      // Mock PDF extraction result based on file name
      const fileName = file.name.toLowerCase();
      let extractedText = "";

      if (fileName.includes("id") || fileName.includes("emirates")) {
        extractedText =
          "Emirates ID application form detected. This document contains personal identification details.";
      } else if (fileName.includes("visa") || fileName.includes("passport")) {
        extractedText =
          "Visa application form detected. This document contains travel authorization details.";
      } else if (
        fileName.includes("license") ||
        fileName.includes("business")
      ) {
        extractedText =
          "Business license application detected. This document contains commercial registration details.";
      } else if (fileName.includes("vehicle") || fileName.includes("car")) {
        extractedText =
          "Vehicle registration form detected. This document contains motor vehicle details.";
      } else {
        extractedText =
          "PDF document detected. I can see multiple pages with text content.";
      }

      resolve(extractedText);
    }, 1500);
  });
}

// Main function to process any uploaded file
export async function processFile(file: File): Promise<{
  text: string;
  fileType: string;
  fileName: string;
  fileSize: string;
}> {
  let extractedText = "";

  // Process based on file type
  if (file.type.includes("pdf")) {
    extractedText = await extractTextFromPDF(file);
  } else if (file.type.includes("image")) {
    extractedText = await extractTextFromImage(file);
  } else {
    extractedText =
      "Unsupported file type. I can only process PDF and image files.";
  }

  // Format file size
  const fileSizeKB = file.size / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  const fileSize =
    fileSizeMB >= 1
      ? `${fileSizeMB.toFixed(2)} MB`
      : `${fileSizeKB.toFixed(2)} KB`;

  return {
    text: extractedText,
    fileType: file.type,
    fileName: file.name,
    fileSize: fileSize,
  };
}

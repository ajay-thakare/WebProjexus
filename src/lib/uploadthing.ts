// refer :-https://docs.uploadthing.com/api-reference/react#generate-upload-dropzone

import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generate components
export const Uploader = generateUploader<OurFileRouter>();
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Generate helpers
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

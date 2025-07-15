import { generateReactHelpers } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core'; // adjust the path as needed

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

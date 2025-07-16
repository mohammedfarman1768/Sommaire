import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileName(fileUrl: string): string {
  try {
    const parts = fileUrl.split('/');
    const rawFile = parts[parts.length - 1];
    return decodeURIComponent(rawFile.split('?')[0]);
  } catch {
    return 'Untitled';
  }
}

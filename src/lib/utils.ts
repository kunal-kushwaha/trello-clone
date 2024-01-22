import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
// Merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get absolute url
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

// Fetch data
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
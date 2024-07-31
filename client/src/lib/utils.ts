import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const statusOptions = [
  { label: 'To-Do', value: 'to-do' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Finished', value: 'finished' },
];

export const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "Urgent", value: "urgent" },
];
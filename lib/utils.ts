import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date)
    .toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
    })
    .replace("/", ".")
}

export function generateTimeSlots() {
  const slots = []
  for (let hour = 1; hour <= 6; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    }
  }
  return slots
}


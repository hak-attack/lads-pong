import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFadeInDelayClass(index: number): string {
  const delayMap: Record<number, string> = {
    0: 'animate-fade-in-up',
    1: 'animate-fade-in-up-delay-1',
    2: 'animate-fade-in-up-delay-2',
    3: 'animate-fade-in-up-delay-3',
    4: 'animate-fade-in-up-delay-4',
  }
  return delayMap[index] || 'animate-fade-in-up-delay-5'
}

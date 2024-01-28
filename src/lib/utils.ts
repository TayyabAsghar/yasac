import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { ThreadComments } from '@/core/types/thread-data';

// generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${time} - ${formattedDate}`;
}

export function formatThreadCount(count: number): string {
  if (count === 0) {
    return 'No Threads';
  } else {
    const threadCount = count.toString().padStart(2, '0');
    const threadWord = count === 1 ? 'Thread' : 'Threads';
    return `${threadCount} ${threadWord}`;
  }
}

export function formatNumber(count: number): string {
  if (count < 1000) return count.toString();
  else if (count < 1000000) return `${(count / 1000).toFixed(1)} k`;
  else return count.toString();
};

export function getFirstTwoDistinctComments(array: any[]): ThreadComments[] {
  let distinctImages = new Set();
  let distinctObjects = [];

  for (let i = 0; i < array.length; i++) {
    if (!distinctImages.has(array[i].author.username)) {
      distinctImages.add(array[i].author.username);
      distinctObjects.push(array[i]);
    }

    if (distinctImages.size === 2) break;
  }
  return distinctObjects;
};

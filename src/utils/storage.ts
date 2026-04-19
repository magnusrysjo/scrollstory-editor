import type { Story } from '../types/story';

const STORAGE_KEY = 'scrollstory_v1';

export function saveStory(story: Story): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
  } catch {
    console.warn('Kunde inte spara story till localStorage');
  }
}

export function loadStory(): Story | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Story;
  } catch {
    return null;
  }
}

export function clearStory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

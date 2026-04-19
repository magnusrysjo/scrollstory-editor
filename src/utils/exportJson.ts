import type { Story } from '../types/story';

export function exportStoryJson(story: Story): void {
  const json = JSON.stringify(story, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story.title.replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importStoryJson(): Promise<Story> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error('Ingen fil vald'));
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const story = JSON.parse(e.target?.result as string) as Story;
          resolve(story);
        } catch {
          reject(new Error('Ogiltig JSON-fil'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

import { useEffect, useRef, useState } from 'react';

// Returnerar ett värde 0–1 som visar hur långt användaren scrollat igenom elementet
export function useScrollProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scrollContainer = el.closest('[data-scroll-container]') ?? window;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress 0 = överkant av element når botten av viewport
      // progress 1 = underkant av element lämnar toppen av viewport
      const total = rect.height + windowH;
      const current = windowH - rect.top;
      setProgress(Math.min(1, Math.max(0, current / total)));
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

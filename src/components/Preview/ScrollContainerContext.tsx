import { createContext, useContext } from 'react';

// Håller en ref till preview-panelens scroll-container så att
// useInView kan använda rätt root istället för window.
export const ScrollContainerContext = createContext<HTMLElement | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}

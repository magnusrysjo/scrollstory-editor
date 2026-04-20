export type FontOption = {
  label: string;
  value: string;       // CSS font-family-sträng
  gfFamily: string;    // Google Fonts family-namn för länk
  gfWeights: string;   // t.ex. "400;700"
};

export const HEADING_FONTS: FontOption[] = [
  { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif", gfFamily: 'Playfair+Display', gfWeights: 'ital,wght@0,400;0,700;1,400' },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', Georgia, serif", gfFamily: 'Cormorant+Garamond', gfWeights: 'ital,wght@0,400;0,700;1,400' },
  { label: 'DM Serif Display', value: "'DM Serif Display', Georgia, serif", gfFamily: 'DM+Serif+Display', gfWeights: 'ital@0;1' },
  { label: 'Libre Baskerville', value: "'Libre Baskerville', Georgia, serif", gfFamily: 'Libre+Baskerville', gfWeights: 'wght@400;700' },
  { label: 'Fraunces', value: "'Fraunces', Georgia, serif", gfFamily: 'Fraunces', gfWeights: 'ital,wght@0,400;0,700;1,400' },
  { label: 'Space Grotesk', value: "'Space Grotesk', system-ui, sans-serif", gfFamily: 'Space+Grotesk', gfWeights: 'wght@400;700' },
  { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif", gfFamily: 'Bebas+Neue', gfWeights: 'wght@400' },
  { label: 'Lora', value: "'Lora', Georgia, serif", gfFamily: 'Lora', gfWeights: 'ital,wght@0,400;0,700;1,400' },
];

export const BODY_FONTS: FontOption[] = [
  { label: 'Inter', value: "'Inter', system-ui, sans-serif", gfFamily: 'Inter', gfWeights: 'wght@400;500' },
  { label: 'Lato', value: "'Lato', system-ui, sans-serif", gfFamily: 'Lato', gfWeights: 'wght@400;700' },
  { label: 'DM Sans', value: "'DM+Sans', system-ui, sans-serif", gfFamily: 'DM+Sans', gfWeights: 'wght@400;500' },
  { label: 'Source Sans 3', value: "'Source Sans 3', system-ui, sans-serif", gfFamily: 'Source+Sans+3', gfWeights: 'wght@400;600' },
  { label: 'Nunito', value: "'Nunito', system-ui, sans-serif", gfFamily: 'Nunito', gfWeights: 'wght@400;600' },
  { label: 'Merriweather', value: "'Merriweather', Georgia, serif", gfFamily: 'Merriweather', gfWeights: 'wght@400;700' },
  { label: 'Open Sans', value: "'Open Sans', system-ui, sans-serif", gfFamily: 'Open+Sans', gfWeights: 'wght@400;600' },
];

// Laddar in ett Google Fonts-typsnitt dynamiskt i dokumentet
export function loadGoogleFont(font: FontOption): void {
  const id = `gf-${font.gfFamily}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.gfFamily}:${font.gfWeights}&display=swap`;
  document.head.appendChild(link);
}

// Returnerar Google Fonts URL-sträng för ett typsnittsnamn (för HTML-export)
export function googleFontsUrl(fonts: FontOption[]): string {
  const families = fonts.map((f) => `family=${f.gfFamily}:${f.gfWeights}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function findFont(value: string, list: FontOption[]): FontOption | undefined {
  return list.find((f) => f.value === value);
}

// Returnerar true om värdet INTE finns i listan (dvs. eget typsnitt)
export function isCustomFont(value: string, list: FontOption[]): boolean {
  return !list.some((f) => f.value === value);
}

// Extraherar visningsnamnet ur en CSS-font-family-sträng, t.ex. "'Oswald', sans-serif" → "Oswald"
export function customFontDisplayName(value: string): string {
  const m = value.match(/^'([^']+)'/);
  return m ? m[1] : value;
}

// Laddar ett eget Google Fonts-typsnitt och returnerar CSS-värdet
export function loadCustomFont(familyName: string): string {
  const trimmed = familyName.trim();
  if (!trimmed) return '';
  const gfFamily = trimmed.replace(/\s+/g, '+');
  const id = `gf-custom-${gfFamily}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${gfFamily}:ital,wght@0,400;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  }
  return `'${trimmed}', sans-serif`;
}

// Bygger GF-URL för ett eget typsnitt (för HTML-export)
export function customFontUrl(cssValue: string): string {
  const name = customFontDisplayName(cssValue);
  const gfFamily = name.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${gfFamily}:ital,wght@0,400;0,700;1,400&display=swap`;
}

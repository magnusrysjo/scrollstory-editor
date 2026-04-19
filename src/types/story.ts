export type Story = {
  id: string;
  title: string;
  sections: Section[];
  theme: StoryTheme;
};

export type Section = {
  id: string;
  background: BackgroundLayer;
  blocks: ContentBlock[];
  transition: TransitionType;
};

export type BackgroundLayer =
  | { type: 'color'; value: string }
  | { type: 'image'; src: string; alt: string; parallax: boolean }
  | { type: 'video'; src: string; loop: boolean }
  | { type: 'map'; center: [number, number]; zoom: number; markers?: MapMarker[] };

export type MapMarker = {
  id: string;
  position: [number, number];
  label?: string;
};

export type ContentBlock =
  | { type: 'text'; id: string; content: string; style: TextStyle }
  | { type: 'image'; id: string; src: string; alt: string; caption?: string }
  | { type: 'chart'; id: string; chartType: string; data: unknown }
  | { type: 'spacer'; id: string; height: number };

export type TransitionType = 'fade' | 'slide-up' | 'parallax' | 'cut';

export type TextStyle = {
  variant: 'heading' | 'subheading' | 'body' | 'quote' | 'caption';
  alignment: 'left' | 'center' | 'right';
  color?: string;
};

export type StoryTheme = {
  fontHeading: string;
  fontBody: string;
  colorPrimary: string;
  colorBackground: string;
  colorText: string;
};

// Fält som kan uppdateras på ett ContentBlock (utan type/id)
export type ContentBlockFields = {
  content?: string;
  style?: TextStyle;
  height?: number;
  src?: string;
  alt?: string;
  caption?: string;
  chartType?: string;
  data?: unknown;
  parallax?: boolean;
  loop?: boolean;
};

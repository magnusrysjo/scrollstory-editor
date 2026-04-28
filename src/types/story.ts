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
  colorText?: string;    // overridar theme.colorText för denna sektion
  minHeight?: number;    // min-höjd i vh-enheter, standard 150
  paddingLeft?: number;  // vänstermarginal i vw-enheter, standard 8
  paddingRight?: number; // högermarginal i vw-enheter, standard 8
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

export type ChartDataRow = Record<string, string | number>;

export type ContentBlock =
  | { type: 'text'; id: string; content: string; style: TextStyle }
  | { type: 'image'; id: string; src: string; alt: string; caption?: string }
  | { type: 'quote'; id: string; content: string; attribution?: string }
  | { type: 'chart'; id: string; chartType: 'bar' | 'line' | 'area'; data: ChartDataRow[]; dataKey: string; xKey: string; label?: string }
  | { type: 'map'; id: string; center: [number, number]; zoom: number; markers?: MapMarker[] }
  | { type: 'spacer'; id: string; height: number };

export type TransitionType = 'fade' | 'slide-up' | 'parallax' | 'cut';

export type TextStyle = {
  variant: 'heading' | 'subheading' | 'body' | 'quote' | 'caption';
  alignment: 'left' | 'center' | 'right';
  color?: string;
  fontSize?: number;    // rem-värde. Saknas = CSS-klassens standard.
  lineHeight?: number;  // t.ex. 1.4. Saknas = CSS-klassens standard.
  bold?: boolean;       // overridar CSS-klassens font-weight
  italic?: boolean;     // overridar CSS-klassens font-style
};

export type StoryTheme = {
  fontHeading: string;
  fontBody: string;
  fontCaption: string;
  fontHeadingUrl?: string;
  fontBodyUrl?: string;
  fontCaptionUrl?: string;
  colorPrimary: string;
  colorBackground: string;
  colorText: string;
};

export type ContentBlockFields = {
  content?: string;
  style?: TextStyle;
  height?: number;
  src?: string;
  alt?: string;
  caption?: string;
  attribution?: string;
  chartType?: 'bar' | 'line' | 'area';
  data?: ChartDataRow[];
  dataKey?: string;
  xKey?: string;
  label?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  parallax?: boolean;
  loop?: boolean;
};

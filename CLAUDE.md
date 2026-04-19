# Scrollstory Editor

## Project Overview
A visual scrollytelling editor where users build interactive, scroll-driven stories combining text, images, video, maps, and data visualizations. The editor uses a split-view layout with section editing on the left and a live scroll-preview on the right.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: CSS Modules (no Tailwind — we want full control over the editor UI)
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Animations**: framer-motion
- **Scroll detection**: Intersection Observer API (native)
- **Icons**: lucide-react
- **Maps** (later): react-leaflet
- **Charts** (later): recharts

## Architecture

### Data Model (core types)
```typescript
type Story = {
  id: string;
  title: string;
  sections: Section[];
  theme: StoryTheme;
};

type Section = {
  id: string;
  background: BackgroundLayer;
  blocks: ContentBlock[];
  transition: TransitionType;
};

type BackgroundLayer =
  | { type: "color"; value: string }
  | { type: "image"; src: string; alt: string; parallax: boolean }
  | { type: "video"; src: string; loop: boolean }
  | { type: "map"; center: [number, number]; zoom: number; markers?: MapMarker[] };

type ContentBlock =
  | { type: "text"; id: string; content: string; style: TextStyle }
  | { type: "image"; id: string; src: string; alt: string; caption?: string }
  | { type: "chart"; id: string; chartType: string; data: unknown }
  | { type: "spacer"; id: string; height: number };

type TransitionType = "fade" | "slide-up" | "parallax" | "cut";

type TextStyle = {
  variant: "heading" | "subheading" | "body" | "quote" | "caption";
  alignment: "left" | "center" | "right";
  color?: string;
};

type StoryTheme = {
  fontHeading: string;
  fontBody: string;
  colorPrimary: string;
  colorBackground: string;
  colorText: string;
};
```

### App Structure
```
src/
  components/
    Editor/
      EditorLayout.tsx        # Split-view shell
      SectionList.tsx          # Left panel: sortable section list
      SectionEditor.tsx        # Edit a single section's blocks
      BlockPalette.tsx         # "Add block" toolbar
      BlockEditor.tsx          # Per-block-type editors
    Preview/
      PreviewPane.tsx          # Right panel: scrollable preview
      SectionRenderer.tsx      # Renders one section with sticky bg
      BlockRenderer.tsx        # Renders a content block
      ScrollTrigger.tsx        # Intersection Observer wrapper
    shared/
      Button.tsx
      IconButton.tsx
      Panel.tsx
  hooks/
    useStory.ts               # Story state + actions (useReducer)
    useScrollProgress.ts      # Track scroll % within a section
    useInView.ts              # Intersection Observer hook
  types/
    story.ts                  # All type definitions
  utils/
    id.ts                     # nanoid wrapper
    export.ts                 # (later) HTML export
  App.tsx
  main.tsx
```

### State Management
Use `useReducer` with a `StoryAction` union type. No external state library.
Actions: `ADD_SECTION`, `REMOVE_SECTION`, `REORDER_SECTIONS`, `UPDATE_SECTION`, `ADD_BLOCK`, `REMOVE_BLOCK`, `REORDER_BLOCKS`, `UPDATE_BLOCK`, `UPDATE_THEME`, `SELECT_SECTION`.

Pass dispatch down via context (`StoryContext`).

### Preview Rendering Strategy
Each section in the preview:
1. Wraps background in a `position: sticky; top: 0` container
2. Content blocks sit in a relatively-positioned overlay that scrolls naturally
3. `IntersectionObserver` on each section triggers enter/exit animations
4. Sections have enough min-height (~150vh) to allow scroll-through

**Key implementation detail:** The background uses `position: sticky; top: 0; height: 100vh` and the content uses `margin-top: -100vh` to overlap the background. The section height = 100vh (bg) + content height - 100vh (negative margin) = content height.

## Design Direction
**Aesthetic**: Editorial / magazine-inspired — clean, sophisticated, content-first.
- Dark sidebar (editor panel) with light preview area
- Monospace accents for labels/metadata, serif for preview content
- Subtle grid lines in editor, generous whitespace in preview
- Accent color: warm amber (#E8A838) on dark charcoal (#1A1A2E)
- Transitions: smooth, purposeful — no bouncy/playful animations

## Build Phases

### Phase 1: Core rendering + basic editor ← DONE
- [x] Vite + React + TS project scaffold
- [x] Type definitions in `types/story.ts`
- [x] `useStory` reducer with all actions
- [x] `StoryContext` provider
- [x] `EditorLayout` split-view
- [x] `SectionList` showing sections as cards
- [x] `SectionEditor` with text block editing
- [x] `BlockPalette` with "Add text" and "Add spacer" buttons
- [x] `PreviewPane` rendering sections with sticky backgrounds
- [x] `SectionRenderer` + `BlockRenderer` for text and spacer
- [x] Hard-coded demo story to verify scroll behavior
- [x] Basic CSS Modules styling matching design direction

### Phase 2: Drag-and-drop + more blocks
- [ ] dnd-kit for section reordering
- [ ] dnd-kit for block reordering within sections
- [ ] Image block (with file upload / URL input)
- [ ] Background image/color picker per section
- [ ] Section transition selector

### Phase 3: Scroll triggers + animations
- [ ] `useScrollProgress` hook per section
- [ ] Fade-in/slide-up animations on blocks via framer-motion
- [ ] Visual keyframe markers on a mini-timeline per section
- [ ] Parallax background option

### Phase 4: Rich content blocks
- [ ] Map block (react-leaflet)
- [ ] Chart block (recharts)
- [ ] Video background support
- [ ] Quote/callout block styling

### Phase 5: Export + persistence
- [ ] Export story as standalone HTML file
- [ ] Save/load story as JSON (localStorage)
- [ ] Import story from JSON file

## Code Style
- Functional components only, no classes
- Named exports, one component per file
- CSS Modules: `ComponentName.module.css`
- Use `crypto.randomUUID()` for IDs (or nanoid if installed)
- Swedish comments are fine, English for code/types/props
- Keep components under 150 lines — extract early

## Important Notes
- The preview must feel like the final output. Scroll behavior in preview = scroll behavior in export.
- Never use `overflow: hidden` on the preview container — natural page scroll is essential.
- Background layers must use `position: sticky` not `position: fixed` (fixed breaks inside scroll containers).
- Test with at least 3 sections to verify scroll transitions between them.

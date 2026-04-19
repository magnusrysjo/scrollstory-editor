import { createContext, useContext, useReducer } from 'react';
import type { Dispatch } from 'react';
import type { Story, Section, ContentBlock, ContentBlockFields, StoryTheme } from '../types/story';
import { demoStory } from '../data/demoStory';

// --- State ---

type StoryState = {
  story: Story;
  selectedSectionId: string | null;
};

// --- Actions ---

export type StoryAction =
  | { type: 'ADD_SECTION'; payload: { section: Section } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: string } }
  | { type: 'REORDER_SECTIONS'; payload: { sectionIds: string[] } }
  | { type: 'UPDATE_SECTION'; payload: { sectionId: string; updates: Partial<Omit<Section, 'id'>> } }
  | { type: 'SELECT_SECTION'; payload: { sectionId: string | null } }
  | { type: 'ADD_BLOCK'; payload: { sectionId: string; block: ContentBlock } }
  | { type: 'REMOVE_BLOCK'; payload: { sectionId: string; blockId: string } }
  | { type: 'REORDER_BLOCKS'; payload: { sectionId: string; blockIds: string[] } }
  | { type: 'UPDATE_BLOCK'; payload: { sectionId: string; blockId: string; updates: ContentBlockFields } }
  | { type: 'UPDATE_THEME'; payload: { updates: Partial<StoryTheme> } };

// --- Reducer ---

const initialState: StoryState = {
  story: demoStory,
  selectedSectionId: null,
};

function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case 'ADD_SECTION':
      return {
        ...state,
        story: { ...state.story, sections: [...state.story.sections, action.payload.section] },
      };

    case 'REMOVE_SECTION':
      return {
        ...state,
        selectedSectionId:
          state.selectedSectionId === action.payload.sectionId ? null : state.selectedSectionId,
        story: {
          ...state.story,
          sections: state.story.sections.filter((s) => s.id !== action.payload.sectionId),
        },
      };

    case 'REORDER_SECTIONS': {
      const map = new Map(state.story.sections.map((s) => [s.id, s]));
      return {
        ...state,
        story: {
          ...state.story,
          sections: action.payload.sectionIds.map((id) => map.get(id)!).filter(Boolean),
        },
      };
    }

    case 'UPDATE_SECTION':
      return {
        ...state,
        story: {
          ...state.story,
          sections: state.story.sections.map((s) =>
            s.id === action.payload.sectionId ? { ...s, ...action.payload.updates } : s,
          ),
        },
      };

    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.payload.sectionId };

    case 'ADD_BLOCK':
      return {
        ...state,
        story: {
          ...state.story,
          sections: state.story.sections.map((s) =>
            s.id === action.payload.sectionId
              ? { ...s, blocks: [...s.blocks, action.payload.block] }
              : s,
          ),
        },
      };

    case 'REMOVE_BLOCK':
      return {
        ...state,
        story: {
          ...state.story,
          sections: state.story.sections.map((s) =>
            s.id === action.payload.sectionId
              ? { ...s, blocks: s.blocks.filter((b) => b.id !== action.payload.blockId) }
              : s,
          ),
        },
      };

    case 'REORDER_BLOCKS': {
      const { sectionId, blockIds } = action.payload;
      return {
        ...state,
        story: {
          ...state.story,
          sections: state.story.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const map = new Map(s.blocks.map((b) => [b.id, b]));
            return { ...s, blocks: blockIds.map((id) => map.get(id)!).filter(Boolean) };
          }),
        },
      };
    }

    case 'UPDATE_BLOCK':
      return {
        ...state,
        story: {
          ...state.story,
          sections: state.story.sections.map((s) =>
            s.id === action.payload.sectionId
              ? {
                  ...s,
                  blocks: s.blocks.map((b) =>
                    b.id === action.payload.blockId
                      ? ({ ...b, ...action.payload.updates } as ContentBlock)
                      : b,
                  ),
                }
              : s,
          ),
        },
      };

    case 'UPDATE_THEME':
      return {
        ...state,
        story: { ...state.story, theme: { ...state.story.theme, ...action.payload.updates } },
      };

    default:
      return state;
  }
}

// --- Context ---

type StoryContextValue = {
  state: StoryState;
  dispatch: Dispatch<StoryAction>;
};

export const StoryContext = createContext<StoryContextValue | null>(null);

export function useStoryContext(): StoryContextValue {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStoryContext måste användas inuti StoryProvider');
  return ctx;
}

export { useReducer, storyReducer, initialState };
export type { StoryState };

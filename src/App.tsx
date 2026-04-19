import { useReducer, useEffect } from 'react';
import { StoryContext, storyReducer, initialState } from './hooks/useStory';
import { EditorLayout } from './components/Editor/EditorLayout';
import { saveStory, loadStory } from './utils/storage';

export function App() {
  const saved = loadStory();
  const [state, dispatch] = useReducer(storyReducer, {
    ...initialState,
    story: saved ?? initialState.story,
  });

  // Auto-spara varje gång story ändras
  useEffect(() => {
    saveStory(state.story);
  }, [state.story]);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      <EditorLayout />
    </StoryContext.Provider>
  );
}

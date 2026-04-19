import { useReducer } from 'react';
import { StoryContext, storyReducer, initialState } from './hooks/useStory';
import { EditorLayout } from './components/Editor/EditorLayout';

export function App() {
  const [state, dispatch] = useReducer(storyReducer, initialState);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      <EditorLayout />
    </StoryContext.Provider>
  );
}

import { useRef, useState, useEffect } from 'react';
import { useStoryContext } from '../../hooks/useStory';
import { SectionList } from './SectionList';
import { SectionEditor } from './SectionEditor';
import { PreviewPane } from '../Preview/PreviewPane';
import { ScrollContainerContext } from '../Preview/ScrollContainerContext';
import styles from './EditorLayout.module.css';

export function EditorLayout() {
  const { state, dispatch } = useStoryContext();
  const { story, selectedSectionId } = state;
  const selectedSection = story.sections.find((s) => s.id === selectedSectionId) ?? null;

  const previewRef = useRef<HTMLElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  // Koppla scroll-container-elementet till context när det är mountat
  useEffect(() => {
    setScrollContainer(previewRef.current);
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <span className={styles.appLabel}>SCROLLSTORY</span>
          <h1 className={styles.storyTitle}>{story.title}</h1>
        </header>

        <SectionList
          sections={story.sections}
          selectedSectionId={selectedSectionId}
          dispatch={dispatch}
        />

        {selectedSection && (
          <SectionEditor
            key={selectedSection.id}
            section={selectedSection}
            dispatch={dispatch}
          />
        )}

        {!selectedSection && (
          <div className={styles.emptyHint}>
            <p>Välj en sektion för att redigera den.</p>
          </div>
        )}
      </aside>

      <ScrollContainerContext.Provider value={scrollContainer}>
        <main ref={previewRef} className={styles.previewArea} data-scroll-container>
          <PreviewPane story={story} selectedSectionId={selectedSectionId} />
        </main>
      </ScrollContainerContext.Provider>
    </div>
  );
}

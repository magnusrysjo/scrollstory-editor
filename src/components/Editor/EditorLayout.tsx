import { useStoryContext } from '../../hooks/useStory';
import { SectionList } from './SectionList';
import { SectionEditor } from './SectionEditor';
import { PreviewPane } from '../Preview/PreviewPane';
import styles from './EditorLayout.module.css';

export function EditorLayout() {
  const { state, dispatch } = useStoryContext();
  const { story, selectedSectionId } = state;

  const selectedSection = story.sections.find((s) => s.id === selectedSectionId) ?? null;

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

      <main className={styles.previewArea} data-scroll-container>
        <PreviewPane story={story} selectedSectionId={selectedSectionId} />
      </main>
    </div>
  );
}

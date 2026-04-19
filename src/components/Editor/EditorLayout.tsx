import { useRef, useState, useEffect } from 'react';
import { useStoryContext } from '../../hooks/useStory';
import { SectionList } from './SectionList';
import { SectionEditor } from './SectionEditor';
import { PreviewPane } from '../Preview/PreviewPane';
import { ScrollContainerContext } from '../Preview/ScrollContainerContext';
import { exportStoryJson, importStoryJson } from '../../utils/exportJson';
import { exportStoryHtml } from '../../utils/exportHtml';
import { clearStory } from '../../utils/storage';
import { demoStory } from '../../data/demoStory';
import styles from './EditorLayout.module.css';

export function EditorLayout() {
  const { state, dispatch } = useStoryContext();
  const { story, selectedSectionId } = state;
  const selectedSection = story.sections.find((s) => s.id === selectedSectionId) ?? null;

  const previewRef = useRef<HTMLElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    setScrollContainer(previewRef.current);
  }, []);

  const showMsg = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 2500);
  };

  const handleExportJson = () => {
    exportStoryJson(story);
    showMsg('JSON exporterad');
  };

  const handleImportJson = async () => {
    try {
      const imported = await importStoryJson();
      dispatch({ type: 'UPDATE_THEME', payload: { updates: imported.theme } });
      // Ladda om sidan med ny story via en fullständig state-reset
      // Enklaste sättet: spara till localStorage och ladda om
      localStorage.setItem('scrollstory_v1', JSON.stringify(imported));
      window.location.reload();
    } catch {
      showMsg('Kunde inte importera filen');
    }
  };

  const handleExportHtml = () => {
    exportStoryHtml(story);
    showMsg('HTML exporterad');
  };

  const handleReset = () => {
    if (!confirm('Återställ till demo-storyn? Alla ändringar försvinner.')) return;
    clearStory();
    localStorage.setItem('scrollstory_v1', JSON.stringify(demoStory));
    window.location.reload();
  };

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

        {/* Toolbar längst ner */}
        <div className={styles.toolbar}>
          {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
          {!saveMsg && <span className={styles.autoSave}>● Auto-sparad</span>}
          <div className={styles.toolbarBtns}>
            <button className={styles.toolBtn} onClick={handleImportJson} title="Importera JSON">↑ Importera</button>
            <button className={styles.toolBtn} onClick={handleExportJson} title="Exportera JSON">↓ JSON</button>
            <button className={styles.toolBtn} onClick={handleExportHtml} title="Exportera HTML">↓ HTML</button>
            <button className={`${styles.toolBtn} ${styles.toolBtnDanger}`} onClick={handleReset} title="Återställ">↺</button>
          </div>
        </div>
      </aside>

      <ScrollContainerContext.Provider value={scrollContainer}>
        <main ref={previewRef} className={styles.previewArea} data-scroll-container>
          <PreviewPane story={story} selectedSectionId={selectedSectionId} />
        </main>
      </ScrollContainerContext.Provider>
    </div>
  );
}

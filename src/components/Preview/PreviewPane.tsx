import type { Story } from '../../types/story';
import { SectionRenderer } from './SectionRenderer';
import styles from './PreviewPane.module.css';

type Props = {
  story: Story;
  selectedSectionId: string | null;
};

export function PreviewPane({ story, selectedSectionId }: Props) {
  return (
    <div className={styles.pane}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>FÖRHANDSGRANSKNING</span>
        <span className={styles.previewTitle}>{story.title}</span>
      </div>

      <div className={styles.sections}>
        {story.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            isSelected={section.id === selectedSectionId}
          />
        ))}

        {story.sections.length === 0 && (
          <div className={styles.empty}>
            <p>Inga sektioner ännu.</p>
            <p>Lägg till en sektion i panelen till vänster.</p>
          </div>
        )}
      </div>
    </div>
  );
}

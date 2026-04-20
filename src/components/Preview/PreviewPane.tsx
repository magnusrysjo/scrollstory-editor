import type { CSSProperties } from 'react';
import type { Story } from '../../types/story';
import { SectionRenderer } from './SectionRenderer';
import styles from './PreviewPane.module.css';

type Props = {
  story: Story;
  selectedSectionId: string | null;
};

export function PreviewPane({ story, selectedSectionId }: Props) {
  // Tema-variabler sprids till alla block via CSS custom properties
  const themeVars: CSSProperties = {
    '--font-heading': story.theme.fontHeading,
    '--font-body': story.theme.fontBody,
    '--color-primary': story.theme.colorPrimary,
    '--color-text': story.theme.colorText,
  } as CSSProperties;

  return (
    <div className={styles.pane}>
      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>FÖRHANDSGRANSKNING</span>
        <span className={styles.previewTitle}>{story.title}</span>
      </div>

      <div className={styles.sections} style={themeVars}>
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

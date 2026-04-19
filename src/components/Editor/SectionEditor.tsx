import type { Dispatch } from 'react';
import type { Section } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { BlockEditor } from './BlockEditor';
import { BlockPalette } from './BlockPalette';
import styles from './SectionEditor.module.css';

type Props = {
  section: Section;
  dispatch: Dispatch<StoryAction>;
};

export function SectionEditor({ section, dispatch }: Props) {
  const bgColor = section.background.type === 'color' ? section.background.value : '#1a1a2e';

  const handleColorChange = (value: string) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: {
        sectionId: section.id,
        updates: { background: { type: 'color', value } },
      },
    });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <span className={styles.label}>REDIGERA SEKTION</span>
      </div>

      {/* Bakgrundsfärg */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Bakgrundsfärg</label>
        <div className={styles.colorRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={bgColor}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span className={styles.colorValue}>{bgColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Block-lista */}
      <div className={styles.blocks}>
        {section.blocks.length === 0 && (
          <p className={styles.emptyBlocks}>Inga block — lägg till ett nedan.</p>
        )}
        {section.blocks.map((block) => (
          <BlockEditor key={block.id} block={block} sectionId={section.id} dispatch={dispatch} />
        ))}
      </div>

      {/* Lägg till block */}
      <BlockPalette sectionId={section.id} dispatch={dispatch} />
    </div>
  );
}

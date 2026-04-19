import type { Dispatch } from 'react';
import type { Section } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { generateId } from '../../utils/id';
import styles from './SectionList.module.css';

type Props = {
  sections: Section[];
  selectedSectionId: string | null;
  dispatch: Dispatch<StoryAction>;
};

function createNewSection(): Section {
  return {
    id: generateId(),
    background: { type: 'color', value: '#2a2a4a' },
    transition: 'cut',
    blocks: [
      {
        type: 'text',
        id: generateId(),
        content: 'Ny sektion',
        style: { variant: 'heading', alignment: 'left' },
      },
    ],
  };
}

export function SectionList({ sections, selectedSectionId, dispatch }: Props) {
  const handleAdd = () => {
    const section = createNewSection();
    dispatch({ type: 'ADD_SECTION', payload: { section } });
    dispatch({ type: 'SELECT_SECTION', payload: { sectionId: section.id } });
  };

  const handleSelect = (sectionId: string) => {
    dispatch({
      type: 'SELECT_SECTION',
      payload: { sectionId: sectionId === selectedSectionId ? null : sectionId },
    });
  };

  const handleRemove = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_SECTION', payload: { sectionId } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>SEKTIONER</span>
        <button className={styles.addBtn} onClick={handleAdd} title="Lägg till sektion">
          +
        </button>
      </div>

      <div className={styles.list}>
        {sections.map((section, index) => {
          const bgColor =
            section.background.type === 'color' ? section.background.value : '#333355';
          const isSelected = section.id === selectedSectionId;

          return (
            <div
              key={section.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => handleSelect(section.id)}
            >
              <div className={styles.cardSwatch} style={{ backgroundColor: bgColor }} />
              <div className={styles.cardInfo}>
                <span className={styles.cardIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.cardMeta}>
                  {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                className={styles.removeBtn}
                onClick={(e) => handleRemove(e, section.id)}
                title="Ta bort sektion"
              >
                ×
              </button>
            </div>
          );
        })}

        {sections.length === 0 && (
          <p className={styles.empty}>Inga sektioner ännu. Lägg till en!</p>
        )}
      </div>
    </div>
  );
}

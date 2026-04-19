import type { Dispatch } from 'react';
import type { StoryAction } from '../../hooks/useStory';
import { generateId } from '../../utils/id';
import styles from './BlockPalette.module.css';

type Props = {
  sectionId: string;
  dispatch: Dispatch<StoryAction>;
};

export function BlockPalette({ sectionId, dispatch }: Props) {
  const addText = () => {
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        sectionId,
        block: {
          type: 'text',
          id: generateId(),
          content: 'Skriv din text här...',
          style: { variant: 'body', alignment: 'left' },
        },
      },
    });
  };

  const addImage = () => {
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        sectionId,
        block: { type: 'image', id: generateId(), src: '', alt: '' },
      },
    });
  };

  const addSpacer = () => {
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        sectionId,
        block: { type: 'spacer', id: generateId(), height: 100 },
      },
    });
  };

  return (
    <div className={styles.palette}>
      <span className={styles.label}>LÄGG TILL BLOCK</span>
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={addText}>
          <span className={styles.icon}>T</span>
          Text
        </button>
        <button className={styles.btn} onClick={addImage}>
          <span className={styles.icon}>▣</span>
          Bild
        </button>
        <button className={styles.btn} onClick={addSpacer}>
          <span className={styles.icon}>↕</span>
          Spacer
        </button>
      </div>
    </div>
  );
}

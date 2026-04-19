import type { Dispatch } from 'react';
import type { ContentBlock } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { generateId } from '../../utils/id';
import styles from './BlockPalette.module.css';

type Props = {
  sectionId: string;
  dispatch: Dispatch<StoryAction>;
};

export function BlockPalette({ sectionId, dispatch }: Props) {
  const add = (block: ContentBlock) =>
    dispatch({ type: 'ADD_BLOCK', payload: { sectionId, block } });

  return (
    <div className={styles.palette}>
      <span className={styles.label}>LÄGG TILL BLOCK</span>
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={() => add({ type: 'text', id: generateId(), content: 'Skriv din text här...', style: { variant: 'body', alignment: 'left' } })}>
          <span className={styles.icon}>T</span>Text
        </button>
        <button className={styles.btn} onClick={() => add({ type: 'quote', id: generateId(), content: 'Citattexten...', attribution: '' })}>
          <span className={styles.icon}>"</span>Citat
        </button>
        <button className={styles.btn} onClick={() => add({ type: 'image', id: generateId(), src: '', alt: '' })}>
          <span className={styles.icon}>▣</span>Bild
        </button>
        <button className={styles.btn} onClick={() => add({ type: 'map', id: generateId(), center: [59.33, 18.06], zoom: 12 })}>
          <span className={styles.icon}>⊕</span>Karta
        </button>
        <button className={styles.btn} onClick={() => add({
          type: 'chart', id: generateId(), chartType: 'bar',
          data: [{ name: 'Jan', värde: 40 }, { name: 'Feb', värde: 70 }, { name: 'Mar', värde: 55 }, { name: 'Apr', värde: 90 }],
          dataKey: 'värde', xKey: 'name', label: 'Diagram',
        })}>
          <span className={styles.icon}>◈</span>Diagram
        </button>
        <button className={styles.btn} onClick={() => add({ type: 'spacer', id: generateId(), height: 100 })}>
          <span className={styles.icon}>↕</span>Spacer
        </button>
      </div>
    </div>
  );
}

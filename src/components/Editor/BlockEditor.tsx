import type { Dispatch } from 'react';
import type { ContentBlock, TextStyle } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './BlockEditor.module.css';

type Props = {
  block: ContentBlock;
  sectionId: string;
  dispatch: Dispatch<StoryAction>;
};

const VARIANT_LABELS: Record<TextStyle['variant'], string> = {
  heading: 'Rubrik',
  subheading: 'Underrubrik',
  body: 'Brödtext',
  quote: 'Citat',
  caption: 'Bildtext',
};

const ALIGNMENT_LABELS: Record<TextStyle['alignment'], string> = {
  left: '←',
  center: '↔',
  right: '→',
};

export function BlockEditor({ block, sectionId, dispatch }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_BLOCK', payload: { sectionId, blockId: block.id } });
  };

  const blockContent = (() => {
    if (block.type === 'text') {
      return (
        <>
          <div className={styles.blockHeader}>
            <button className={styles.dragHandle} {...attributes} {...listeners} title="Dra för att flytta">⠿</button>
            <span className={styles.blockType}>TEXT</span>
            <button className={styles.removeBtn} onClick={handleRemove} title="Ta bort block">×</button>
          </div>

          <textarea
            className={styles.textarea}
            value={block.content}
            rows={4}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_BLOCK',
                payload: { sectionId, blockId: block.id, updates: { content: e.target.value } },
              })
            }
          />

          <div className={styles.styleRow}>
            <select
              className={styles.select}
              value={block.style.variant}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_BLOCK',
                  payload: {
                    sectionId,
                    blockId: block.id,
                    updates: { style: { ...block.style, variant: e.target.value as TextStyle['variant'] } },
                  },
                })
              }
            >
              {(Object.keys(VARIANT_LABELS) as TextStyle['variant'][]).map((v) => (
                <option key={v} value={v}>{VARIANT_LABELS[v]}</option>
              ))}
            </select>

            <div className={styles.alignGroup}>
              {(Object.keys(ALIGNMENT_LABELS) as TextStyle['alignment'][]).map((a) => (
                <button
                  key={a}
                  className={`${styles.alignBtn} ${block.style.alignment === a ? styles.alignBtnActive : ''}`}
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_BLOCK',
                      payload: {
                        sectionId,
                        blockId: block.id,
                        updates: { style: { ...block.style, alignment: a as TextStyle['alignment'] } },
                      },
                    })
                  }
                >
                  {ALIGNMENT_LABELS[a as TextStyle['alignment']]}
                </button>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (block.type === 'image') {
      return (
        <>
          <div className={styles.blockHeader}>
            <button className={styles.dragHandle} {...attributes} {...listeners} title="Dra för att flytta">⠿</button>
            <span className={styles.blockType}>BILD</span>
            <button className={styles.removeBtn} onClick={handleRemove} title="Ta bort block">×</button>
          </div>

          <input
            type="url"
            className={styles.urlInput}
            placeholder="https://example.com/bild.jpg"
            value={block.src}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_BLOCK',
                payload: { sectionId, blockId: block.id, updates: { src: e.target.value } },
              })
            }
          />

          <input
            type="text"
            className={styles.urlInput}
            placeholder="Alt-text / bildtext..."
            value={block.alt}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_BLOCK',
                payload: { sectionId, blockId: block.id, updates: { alt: e.target.value } },
              })
            }
          />

          {block.src && (
            <div
              className={styles.imagePreview}
              style={{ backgroundImage: `url(${block.src})` }}
            />
          )}
        </>
      );
    }

    if (block.type === 'spacer') {
      return (
        <>
          <div className={styles.blockHeader}>
            <button className={styles.dragHandle} {...attributes} {...listeners} title="Dra för att flytta">⠿</button>
            <span className={styles.blockType}>SPACER</span>
            <span className={styles.spacerValue}>{block.height}px</span>
            <button className={styles.removeBtn} onClick={handleRemove} title="Ta bort block">×</button>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={20}
            max={400}
            step={20}
            value={block.height}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_BLOCK',
                payload: { sectionId, blockId: block.id, updates: { height: Number(e.target.value) } },
              })
            }
          />
        </>
      );
    }

    return null;
  })();

  return (
    <div ref={setNodeRef} style={dragStyle} className={styles.block}>
      {blockContent}
    </div>
  );
}

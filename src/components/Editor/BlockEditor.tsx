import type { Dispatch } from 'react';
import type { ContentBlock, TextStyle, ContentBlockFields, FontSize } from '../../types/story';
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
  heading: 'Rubrik', subheading: 'Underrubrik', body: 'Brödtext', quote: 'Citat', caption: 'Bildtext',
};
const ALIGNMENT_LABELS: Record<TextStyle['alignment'], string> = { left: '←', center: '↔', right: '→' };
const FONT_SIZE_LABELS: Record<FontSize, string> = {
  xs: 'XS', sm: 'S', base: 'M', lg: 'L', xl: 'XL', '2xl': '2XL', '3xl': '3XL',
};

export function BlockEditor({ block, sectionId, dispatch }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const remove = () => dispatch({ type: 'REMOVE_BLOCK', payload: { sectionId, blockId: block.id } });
  const update = (updates: ContentBlockFields) =>
    dispatch({ type: 'UPDATE_BLOCK', payload: { sectionId, blockId: block.id, updates } });

  const handle = (
    <button className={styles.dragHandle} {...attributes} {...listeners} title="Dra för att flytta">⠿</button>
  );

  let inner: React.ReactNode = null;

  if (block.type === 'text') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>TEXT</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <textarea className={styles.textarea} value={block.content} rows={4}
          onChange={(e) => update({ content: e.target.value })} />
        <div className={styles.styleRow}>
          <select className={styles.select} value={block.style.variant}
            onChange={(e) => update({ style: { ...block.style, variant: e.target.value as TextStyle['variant'] } })}>
            {(Object.keys(VARIANT_LABELS) as TextStyle['variant'][]).map((v) => (
              <option key={v} value={v}>{VARIANT_LABELS[v]}</option>
            ))}
          </select>
          <div className={styles.alignGroup}>
            {(Object.keys(ALIGNMENT_LABELS) as TextStyle['alignment'][]).map((a) => (
              <button key={a}
                className={`${styles.alignBtn} ${block.style.alignment === a ? styles.alignBtnActive : ''}`}
                onClick={() => update({ style: { ...block.style, alignment: a as TextStyle['alignment'] } })}>
                {ALIGNMENT_LABELS[a as TextStyle['alignment']]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sizeRow}>
          {(Object.keys(FONT_SIZE_LABELS) as FontSize[]).map((s) => (
            <button key={s}
              className={`${styles.sizeBtn} ${(block.style.fontSize ?? 'base') === s ? styles.sizeBtnActive : ''}`}
              onClick={() => update({ style: { ...block.style, fontSize: s } })}>
              {FONT_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </>
    );
  } else if (block.type === 'quote') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>CITAT</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <textarea className={styles.textarea} value={block.content} rows={3} placeholder="Citattexten..."
          onChange={(e) => update({ content: e.target.value })} />
        <input type="text" className={styles.urlInput} value={block.attribution ?? ''} placeholder="Källa / attribution (valfritt)"
          onChange={(e) => update({ attribution: e.target.value })} />
      </>
    );
  } else if (block.type === 'image') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>BILD</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <input type="url" className={styles.urlInput} placeholder="https://example.com/bild.jpg" value={block.src}
          onChange={(e) => update({ src: e.target.value })} />
        <input type="text" className={styles.urlInput} placeholder="Alt-text / bildtext..." value={block.alt}
          onChange={(e) => update({ alt: e.target.value })} />
        {block.src && <div className={styles.imagePreview} style={{ backgroundImage: `url(${block.src})` }} />}
      </>
    );
  } else if (block.type === 'map') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>KARTA</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <div className={styles.coordRow}>
          <div className={styles.coordField}>
            <label className={styles.miniLabel}>Lat</label>
            <input type="number" className={styles.coordInput} step="0.0001" value={block.center[0]}
              onChange={(e) => update({ center: [parseFloat(e.target.value), block.center[1]] })} />
          </div>
          <div className={styles.coordField}>
            <label className={styles.miniLabel}>Lng</label>
            <input type="number" className={styles.coordInput} step="0.0001" value={block.center[1]}
              onChange={(e) => update({ center: [block.center[0], parseFloat(e.target.value)] })} />
          </div>
          <div className={styles.coordField}>
            <label className={styles.miniLabel}>Zoom</label>
            <input type="number" className={styles.coordInput} min={1} max={18} value={block.zoom}
              onChange={(e) => update({ zoom: parseInt(e.target.value) })} />
          </div>
        </div>
      </>
    );
  } else if (block.type === 'chart') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>DIAGRAM</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <div className={styles.styleRow}>
          <select className={styles.select} value={block.chartType}
            onChange={(e) => update({ chartType: e.target.value as 'bar' | 'line' | 'area' })}>
            <option value="bar">Stapel</option>
            <option value="line">Linje</option>
            <option value="area">Area</option>
          </select>
        </div>
        <p className={styles.chartHint}>
          Rubrik:{' '}
          <input type="text" className={styles.inlineInput} value={block.label ?? ''} placeholder="Diagramtitel..."
            onChange={(e) => update({ label: e.target.value })} />
        </p>
      </>
    );
  } else if (block.type === 'spacer') {
    inner = (
      <>
        <div className={styles.blockHeader}>{handle}<span className={styles.blockType}>SPACER</span><span className={styles.spacerValue}>{block.height}px</span><button className={styles.removeBtn} onClick={remove}>×</button></div>
        <input type="range" className={styles.slider} min={20} max={400} step={20} value={block.height}
          onChange={(e) => update({ height: Number(e.target.value) })} />
      </>
    );
  }

  return (
    <div ref={setNodeRef} style={dragStyle} className={styles.block}>
      {inner}
    </div>
  );
}

import type { Dispatch } from 'react';
import type { ContentBlock, TextStyle, ContentBlockFields } from '../../types/story';
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
const FONT_SIZE_MIN = 0.5;
const FONT_SIZE_MAX = 8;
const FONT_SIZE_STEP = 0.05;

const LINE_HEIGHT_MIN = 0.8;
const LINE_HEIGHT_MAX = 3.0;
const LINE_HEIGHT_STEP = 0.05;

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
    // Defensiv läsning: gamla localStorage-värden kan vara strängar ('base', 'lg' etc.)
    const fontSize = typeof block.style.fontSize === 'number' ? block.style.fontSize : undefined;
    const lineHeight = typeof block.style.lineHeight === 'number' ? block.style.lineHeight : undefined;

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
            <div className={styles.alignDivider} />
            <button
              className={`${styles.alignBtn} ${styles.boldBtn} ${block.style.bold ? styles.alignBtnActive : ''}`}
              onClick={() => update({ style: { ...block.style, bold: !block.style.bold } })}
              title="Fet stil">
              B
            </button>
            <button
              className={`${styles.alignBtn} ${styles.italicBtn} ${block.style.italic ? styles.alignBtnActive : ''}`}
              onClick={() => update({ style: { ...block.style, italic: !block.style.italic } })}
              title="Kursiv stil">
              I
            </button>
          </div>
        </div>
        <div className={styles.sizeRow}>
          <div className={styles.sizeHeader}>
            <span className={styles.sizeLabel}>Storlek</span>
            {fontSize ? (
              <>
                <span className={styles.sizeValue}>{fontSize.toFixed(2)} rem</span>
                <button
                  className={styles.sizeReset}
                  onClick={() => update({ style: { ...block.style, fontSize: undefined } })}
                  title="Återställ till standard"
                >↺</button>
              </>
            ) : (
              <span className={styles.sizeDefault}>Standard</span>
            )}
          </div>
          <input
            type="range"
            className={styles.slider}
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            step={FONT_SIZE_STEP}
            value={fontSize ?? 1.1}
            onChange={(e) => update({ style: { ...block.style, fontSize: parseFloat(e.target.value) } })}
          />
          <div className={styles.sizeScale}>
            <span>0.5</span><span>2</span><span>4</span><span>6</span><span>8 rem</span>
          </div>
        </div>
        <div className={styles.sizeRow}>
          <div className={styles.sizeHeader}>
            <span className={styles.sizeLabel}>Radavstånd</span>
            {lineHeight ? (
              <>
                <span className={styles.sizeValue}>{lineHeight.toFixed(2)}</span>
                <button
                  className={styles.sizeReset}
                  onClick={() => update({ style: { ...block.style, lineHeight: undefined } })}
                  title="Återställ till standard"
                >↺</button>
              </>
            ) : (
              <span className={styles.sizeDefault}>Standard</span>
            )}
          </div>
          <input
            type="range"
            className={styles.slider}
            min={LINE_HEIGHT_MIN}
            max={LINE_HEIGHT_MAX}
            step={LINE_HEIGHT_STEP}
            value={lineHeight ?? 1.5}
            onChange={(e) => update({ style: { ...block.style, lineHeight: parseFloat(e.target.value) } })}
          />
          <div className={styles.sizeScale}>
            <span>0.8</span><span>1.5</span><span>2.0</span><span>2.5</span><span>3.0</span>
          </div>
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

import type { Dispatch } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { Section, TransitionType } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { BlockEditor } from './BlockEditor';
import { BlockPalette } from './BlockPalette';
import { SectionTimeline } from './SectionTimeline';
import styles from './SectionEditor.module.css';

type Props = {
  section: Section;
  dispatch: Dispatch<StoryAction>;
};

type BgType = 'color' | 'image' | 'video';

const TRANSITION_LABELS: Record<TransitionType, string> = {
  cut: 'Direkt (cut)',
  fade: 'Tona in (fade)',
  'slide-up': 'Glid upp',
  parallax: 'Parallax',
};

export function SectionEditor({ section, dispatch }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const bg = section.background;
  const bgType: BgType = bg.type === 'image' ? 'image' : bg.type === 'video' ? 'video' : 'color';
  const bgColor = bg.type === 'color' ? bg.value : '#1a1a2e';
  const bgSrc = bg.type === 'image' ? bg.src : bg.type === 'video' ? bg.src : '';
  const bgAlt = bg.type === 'image' ? bg.alt : '';
  const bgParallax = bg.type === 'image' ? bg.parallax : false;
  const bgLoop = bg.type === 'video' ? bg.loop : true;

  const switchType = (type: BgType) => {
    if (type === 'color') {
      dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { type: 'color', value: bgColor } } } });
    } else if (type === 'image') {
      dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { type: 'image', src: bgSrc, alt: bgAlt, parallax: bgParallax } } } });
    } else {
      dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { type: 'video', src: bgSrc, loop: bgLoop } } } });
    }
  };

  const updateImage = (fields: Partial<{ src: string; alt: string; parallax: boolean }>) => {
    if (bg.type !== 'image') return;
    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { ...bg, ...fields } } } });
  };

  const updateVideo = (fields: Partial<{ src: string; loop: boolean }>) => {
    if (bg.type !== 'video') return;
    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { ...bg, ...fields } } } });
  };

  const handleBlockDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = section.blocks.findIndex((b) => b.id === active.id);
    const newIndex = section.blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(section.blocks, oldIndex, newIndex);
    dispatch({ type: 'REORDER_BLOCKS', payload: { sectionId: section.id, blockIds: reordered.map((b) => b.id) } });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <span className={styles.label}>REDIGERA SEKTION</span>
      </div>

      {/* Bakgrundstyp-toggle */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Bakgrundstyp</label>
        <div className={styles.typeToggle}>
          {(['color', 'image', 'video'] as BgType[]).map((t) => (
            <button
              key={t}
              className={`${styles.typeBtn} ${bgType === t ? styles.typeBtnActive : ''}`}
              onClick={() => switchType(t)}
            >
              {t === 'color' ? 'Färg' : t === 'image' ? 'Bild' : 'Video'}
            </button>
          ))}
        </div>
      </div>

      {bgType === 'color' && (
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Bakgrundsfärg</label>
          <div className={styles.colorRow}>
            <input
              type="color"
              className={styles.colorInput}
              value={bgColor}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { background: { type: 'color', value: e.target.value } } } })
              }
            />
            <span className={styles.colorValue}>{bgColor.toUpperCase()}</span>
          </div>
        </div>
      )}

      {bgType === 'image' && (
        <>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Bild-URL</label>
            <input type="url" className={styles.urlInput} placeholder="https://example.com/bild.jpg" value={bgSrc} onChange={(e) => updateImage({ src: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Alt-text</label>
            <input type="text" className={styles.urlInput} placeholder="Beskriv bilden..." value={bgAlt} onChange={(e) => updateImage({ alt: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" className={styles.checkbox} checked={bgParallax} onChange={(e) => updateImage({ parallax: e.target.checked })} />
              <span className={styles.fieldLabel} style={{ marginBottom: 0 }}>Parallax-effekt</span>
            </label>
          </div>
          {bgSrc && <div className={styles.field}><div className={styles.imagePreview} style={{ backgroundImage: `url(${bgSrc})` }} /></div>}
        </>
      )}

      {bgType === 'video' && (
        <>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Video-URL (.mp4)</label>
            <input type="url" className={styles.urlInput} placeholder="https://example.com/video.mp4" value={bgSrc} onChange={(e) => updateVideo({ src: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" className={styles.checkbox} checked={bgLoop} onChange={(e) => updateVideo({ loop: e.target.checked })} />
              <span className={styles.fieldLabel} style={{ marginBottom: 0 }}>Loopa videon</span>
            </label>
          </div>
        </>
      )}

      {/* Textfärg per sektion */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Textfärg (denna sektion)</label>
        <div className={styles.colorRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={section.colorText ?? '#ffffff'}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { colorText: e.target.value } } })
            }
          />
          <span className={styles.colorValue}>{(section.colorText ?? '#ffffff').toUpperCase()}</span>
          {section.colorText && (
            <button
              className={styles.resetColorBtn}
              onClick={() =>
                dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { colorText: undefined } } })
              }
              title="Återställ till temafärg"
            >
              ↺ Tema
            </button>
          )}
        </div>
        {!section.colorText && (
          <p className={styles.colorHint}>Använder temats globala textfärg</p>
        )}
      </div>

      {/* Övergång */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Övergång till nästa sektion</label>
        <select
          className={styles.select}
          value={section.transition}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { transition: e.target.value as TransitionType } } })
          }
        >
          {(Object.keys(TRANSITION_LABELS) as TransitionType[]).map((t) => (
            <option key={t} value={t}>{TRANSITION_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Mini-tidslinje */}
      <SectionTimeline section={section} />

      {/* Block-lista med drag & drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBlockDragEnd}>
        <SortableContext items={section.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.blocks}>
            {section.blocks.length === 0 && (
              <p className={styles.emptyBlocks}>Inga block — lägg till ett nedan.</p>
            )}
            {section.blocks.map((block) => (
              <BlockEditor key={block.id} block={block} sectionId={section.id} dispatch={dispatch} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <BlockPalette sectionId={section.id} dispatch={dispatch} />
    </div>
  );
}

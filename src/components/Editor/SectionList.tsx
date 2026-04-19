import type { Dispatch } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// --- Sortable card ---

type CardProps = {
  section: Section;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (e: React.MouseEvent, id: string) => void;
};

function SortableSectionCard({ section, index, isSelected, onSelect, onRemove }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const bgColor = section.background.type === 'color'
    ? section.background.value
    : section.background.type === 'image' && section.background.src
      ? undefined
      : '#333355';

  const bgImage = section.background.type === 'image' && section.background.src
    ? `url(${section.background.src})`
    : undefined;

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(section.id)}
    >
      {/* Drag-handtag */}
      <button
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        title="Dra för att ordna om"
      >
        ⠿
      </button>

      <div
        className={styles.cardSwatch}
        style={{ backgroundColor: bgColor, backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className={styles.cardInfo}>
        <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.cardMeta}>
          {section.blocks.length} block{section.blocks.length !== 1 ? 's' : ''}
        </span>
      </div>
      <button
        className={styles.removeBtn}
        onClick={(e) => onRemove(e, section.id)}
        title="Ta bort sektion"
      >
        ×
      </button>
    </div>
  );
}

// --- SectionList ---

export function SectionList({ sections, selectedSectionId, dispatch }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    dispatch({ type: 'REORDER_SECTIONS', payload: { sectionIds: reordered.map((s) => s.id) } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>SEKTIONER</span>
        <button className={styles.addBtn} onClick={handleAdd} title="Lägg till sektion">
          +
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.list}>
            {sections.map((section, index) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={index}
                isSelected={section.id === selectedSectionId}
                onSelect={handleSelect}
                onRemove={handleRemove}
              />
            ))}
            {sections.length === 0 && (
              <p className={styles.empty}>Inga sektioner ännu. Lägg till en!</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

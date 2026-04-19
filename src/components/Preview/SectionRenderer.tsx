import type { Section } from '../../types/story';
import { BlockRenderer } from './BlockRenderer';
import styles from './SectionRenderer.module.css';

type Props = {
  section: Section;
  isSelected?: boolean;
};

export function SectionRenderer({ section, isSelected = false }: Props) {
  const bgColor = section.background.type === 'color' ? section.background.value : '#1a1a2e';

  return (
    <section className={`${styles.section} ${isSelected ? styles.sectionSelected : ''}`}>
      {/* Bakgrunden är sticky — stannar kvar medan sektionens innehåll scrollar förbi */}
      <div className={styles.background} style={{ backgroundColor: bgColor }} />

      {/* Innehållet scrollar ovanpå bakgrunden via negativ margin */}
      <div className={styles.content}>
        {section.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {isSelected && <div className={styles.selectedIndicator} />}
    </section>
  );
}

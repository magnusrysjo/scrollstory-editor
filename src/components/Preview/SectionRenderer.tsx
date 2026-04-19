import type { CSSProperties } from 'react';
import type { Section } from '../../types/story';
import { BlockRenderer } from './BlockRenderer';
import styles from './SectionRenderer.module.css';

type Props = {
  section: Section;
  isSelected?: boolean;
};

function buildBackgroundStyle(section: Section): CSSProperties {
  const bg = section.background;

  if (bg.type === 'color') {
    return { backgroundColor: bg.value };
  }

  if (bg.type === 'image') {
    return {
      backgroundImage: bg.src ? `url(${bg.src})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      // Parallax via background-attachment (fungerar i sidans scroll-container)
      backgroundAttachment: bg.parallax ? 'fixed' : 'scroll',
      backgroundColor: '#1a1a2e', // fallback om bilden inte laddats
    };
  }

  return { backgroundColor: '#1a1a2e' };
}

export function SectionRenderer({ section, isSelected = false }: Props) {
  const bgStyle = buildBackgroundStyle(section);

  return (
    <section className={`${styles.section} ${isSelected ? styles.sectionSelected : ''}`}>
      {/* Bakgrunden är sticky — stannar kvar medan sektionens innehåll scrollar förbi */}
      <div className={styles.background} style={bgStyle} />

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

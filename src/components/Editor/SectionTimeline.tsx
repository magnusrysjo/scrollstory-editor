import type { Section } from '../../types/story';
import styles from './SectionTimeline.module.css';

type Props = {
  section: Section;
};

const BLOCK_COLORS: Record<string, string> = {
  text: '#e8a838',
  image: '#5a9fd4',
  spacer: '#4a4a6a',
  chart: '#7ed4a8',
};

const BLOCK_LABELS: Record<string, string> = {
  text: 'T',
  image: '▣',
  spacer: '↕',
  chart: '◈',
};

export function SectionTimeline({ section }: Props) {
  if (section.blocks.length === 0) return null;

  return (
    <div className={styles.timeline}>
      <span className={styles.label}>TIDSLINJE</span>
      <div className={styles.track}>
        <div className={styles.line} />
        {section.blocks.map((block, i) => {
          const pct = section.blocks.length === 1
            ? 50
            : (i / (section.blocks.length - 1)) * 100;

          return (
            <div
              key={block.id}
              className={styles.marker}
              style={{ left: `${pct}%` }}
              title={block.type}
            >
              <div
                className={styles.dot}
                style={{ backgroundColor: BLOCK_COLORS[block.type] ?? '#888' }}
              />
              <span className={styles.markerLabel} style={{ color: BLOCK_COLORS[block.type] ?? '#888' }}>
                {BLOCK_LABELS[block.type] ?? '?'}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.meta}>
        {section.blocks.length} block · övergång: {section.transition}
      </div>
    </div>
  );
}

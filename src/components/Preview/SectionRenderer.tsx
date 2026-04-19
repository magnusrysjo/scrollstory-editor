import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useMotionValueEvent, useScroll, motion } from 'framer-motion';
import type { Section } from '../../types/story';
import { BlockRenderer } from './BlockRenderer';
import { AnimatedBlock } from './AnimatedBlock';
import { useScrollContainer } from './ScrollContainerContext';
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
      backgroundAttachment: bg.parallax ? 'fixed' : 'scroll',
      backgroundColor: '#1a1a2e',
    };
  }

  return { backgroundColor: '#1a1a2e' };
}

export function SectionRenderer({ section, isSelected = false }: Props) {
  const bgStyle = buildBackgroundStyle(section);
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const scrollContainer = useScrollContainer();
  const bg = section.background;
  const isVideo = bg.type === 'video';
  const videoSrc = bg.type === 'video' ? bg.src : '';
  const videoLoop = bg.type === 'video' ? bg.loop : true;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v));

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isSelected ? styles.sectionSelected : ''}`}
    >
      {/* Sticky bakgrund */}
      {isVideo && videoSrc ? (
        <div className={styles.background}>
          <video
            className={styles.videoBg}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            loop={videoLoop}
          />
        </div>
      ) : (
        <div className={styles.background} style={bgStyle} />
      )}

      {/* Innehåll med animerade block */}
      <div className={styles.content}>
        {section.blocks.map((block, i) => (
          <AnimatedBlock key={block.id} transition={section.transition} index={i}>
            <BlockRenderer block={block} />
          </AnimatedBlock>
        ))}
      </div>

      {/* Scroll-progress-bar längst ner i sektionen */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
        />
      </div>

      {isSelected && <div className={styles.selectedIndicator} />}

      {/* Progress-procent, syns bara på vald sektion */}
      {isSelected && (
        <div className={styles.progressLabel}>
          {Math.round(progress * 100)}%
        </div>
      )}
    </section>
  );
}

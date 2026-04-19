import type { ContentBlock, TextStyle } from '../../types/story';
import styles from './BlockRenderer.module.css';

type Props = {
  block: ContentBlock;
};

function getTextClassName(variant: TextStyle['variant']): string {
  const map: Record<TextStyle['variant'], string> = {
    heading: styles.heading,
    subheading: styles.subheading,
    body: styles.body,
    quote: styles.quote,
    caption: styles.caption,
  };
  return map[variant];
}

function getAlignClass(alignment: TextStyle['alignment']): string {
  const map: Record<TextStyle['alignment'], string> = {
    left: styles.alignLeft,
    center: styles.alignCenter,
    right: styles.alignRight,
  };
  return map[alignment];
}

export function BlockRenderer({ block }: Props) {
  if (block.type === 'text') {
    const cls = [getTextClassName(block.style.variant), getAlignClass(block.style.alignment)]
      .join(' ');
    return (
      <div
        className={cls}
        style={block.style.color ? { color: block.style.color } : undefined}
      >
        {block.content}
      </div>
    );
  }

  if (block.type === 'image') {
    if (!block.src) return null;
    return (
      <figure className={styles.imageFigure}>
        <img src={block.src} alt={block.alt} className={styles.image} loading="lazy" />
        {block.caption && <figcaption className={styles.figcaption}>{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'spacer') {
    return <div className={styles.spacer} style={{ height: block.height }} />;
  }

  return null;
}

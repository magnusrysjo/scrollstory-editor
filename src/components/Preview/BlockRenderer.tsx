import { lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { ContentBlock, TextStyle, FontSize } from '../../types/story';
import styles from './BlockRenderer.module.css';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  xs:   '0.7rem',
  sm:   '0.875rem',
  base: '',          // töm = använd CSS-klassens default
  lg:   '1.3rem',
  xl:   '1.6rem',
  '2xl':'2.2rem',
  '3xl':'3.2rem',
};

// Lazy-load tunga block för snabbare initial render
const MapBlock = lazy(() => import('./blocks/MapBlock'));
const ChartBlock = lazy(() => import('./blocks/ChartBlock'));

type Props = {
  block: ContentBlock;
};

function getTextClass(variant: TextStyle['variant']): string {
  const map: Record<TextStyle['variant'], string> = {
    heading: styles.heading, subheading: styles.subheading,
    body: styles.body, quote: styles.quote, caption: styles.caption,
  };
  return map[variant];
}

function getAlignClass(alignment: TextStyle['alignment']): string {
  const map: Record<TextStyle['alignment'], string> = {
    left: styles.alignLeft, center: styles.alignCenter, right: styles.alignRight,
  };
  return map[alignment];
}

export function BlockRenderer({ block }: Props) {
  if (block.type === 'text') {
    const inlineStyle: CSSProperties = {};
    if (block.style.color) inlineStyle.color = block.style.color;
    if (block.style.fontSize && FONT_SIZE_MAP[block.style.fontSize]) {
      inlineStyle.fontSize = FONT_SIZE_MAP[block.style.fontSize];
    }
    return (
      <div
        className={`${getTextClass(block.style.variant)} ${getAlignClass(block.style.alignment)}`}
        style={Object.keys(inlineStyle).length ? inlineStyle : undefined}
      >
        {block.content}
      </div>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className={styles.quoteBlock}>
        <p className={styles.quoteText}>{block.content}</p>
        {block.attribution && (
          <cite className={styles.quoteAttribution}>— {block.attribution}</cite>
        )}
      </blockquote>
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

  if (block.type === 'map') {
    return (
      <Suspense fallback={<div className={styles.blockLoading}>Laddar karta...</div>}>
        <MapBlock center={block.center} zoom={block.zoom} markers={block.markers} />
      </Suspense>
    );
  }

  if (block.type === 'chart') {
    return (
      <Suspense fallback={<div className={styles.blockLoading}>Laddar diagram...</div>}>
        <ChartBlock
          chartType={block.chartType}
          data={block.data}
          dataKey={block.dataKey}
          xKey={block.xKey}
          label={block.label}
        />
      </Suspense>
    );
  }

  if (block.type === 'spacer') {
    return <div className={styles.spacer} style={{ height: block.height }} />;
  }

  return null;
}

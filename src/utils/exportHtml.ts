import type { Story, Section, ContentBlock, BackgroundLayer } from '../types/story';

function renderBgStyle(bg: BackgroundLayer): string {
  if (bg.type === 'color') return `background-color:${bg.value};`;
  if (bg.type === 'image') {
    return `background-image:url(${bg.src});background-size:cover;background-position:center;${bg.parallax ? 'background-attachment:fixed;' : ''}background-color:#1a1a2e;`;
  }
  return 'background-color:#1a1a2e;';
}

function renderBlock(block: ContentBlock): string {
  if (block.type === 'text') {
    const tag = block.style.variant === 'heading' ? 'h2'
      : block.style.variant === 'subheading' ? 'h3'
      : block.style.variant === 'caption' ? 'p'
      : 'p';
    const cls = `block-${block.style.variant} align-${block.style.alignment}`;
    const color = block.style.color ? ` style="color:${block.style.color}"` : '';
    return `<${tag} class="${cls}"${color}>${escHtml(block.content)}</${tag}>`;
  }
  if (block.type === 'quote') {
    return `<blockquote class="block-quote"><p>${escHtml(block.content)}</p>${block.attribution ? `<cite>— ${escHtml(block.attribution)}</cite>` : ''}</blockquote>`;
  }
  if (block.type === 'image' && block.src) {
    return `<figure class="block-image"><img src="${block.src}" alt="${escHtml(block.alt)}" loading="lazy">${block.caption ? `<figcaption>${escHtml(block.caption)}</figcaption>` : ''}</figure>`;
  }
  if (block.type === 'spacer') {
    return `<div style="height:${block.height}px"></div>`;
  }
  // Karta och diagram renderas inte i statisk HTML-export
  if (block.type === 'map') return `<div class="block-placeholder">[ Karta ]</div>`;
  if (block.type === 'chart') return `<div class="block-placeholder">[ Diagram: ${escHtml(block.label ?? '')} ]</div>`;
  return '';
}

function renderBackground(bg: BackgroundLayer): string {
  if (bg.type === 'video' && bg.src) {
    return `<div class="section-bg">
      <video class="section-video" src="${bg.src}" autoplay muted playsinline${bg.loop ? ' loop' : ''}></video>
    </div>`;
  }
  const style = renderBgStyle(bg);
  return `<div class="section-bg" style="${style}"></div>`;
}

function renderSection(section: Section): string {
  const bg = renderBackground(section.background);
  const blocks = section.blocks.map(renderBlock).join('\n');
  return `
  <section class="section">
    ${bg}
    <div class="section-content">
      ${blocks}
    </div>
  </section>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportStoryHtml(story: Story): void {
  const sections = story.sections.map(renderSection).join('\n');
  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(story.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #f8f6f1; -webkit-font-smoothing: antialiased; }

    .section { position: relative; }
    .section-bg { position: sticky; top: 0; height: 100vh; width: 100%; z-index: 0; overflow: hidden; background-color: #1a1a2e; }
    .section-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .section-content { position: relative; z-index: 1; margin-top: -100vh; min-height: 150vh; padding: 12vh 8vw 8vh; display: flex; flex-direction: column; justify-content: center; }

    .block-heading { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem,5vw,3.5rem); font-weight: 700; line-height: 1.1; color: #fff; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
    .block-subheading { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.2rem,3vw,1.8rem); font-weight: 400; font-style: italic; color: rgba(255,255,255,0.85); margin-bottom: 1rem; }
    .block-body { font-family: 'Inter', system-ui, sans-serif; font-size: clamp(0.95rem,1.5vw,1.1rem); line-height: 1.75; color: rgba(255,255,255,0.8); margin-bottom: 1rem; max-width: 60ch; }
    .block-caption { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-bottom: 0.75rem; text-transform: uppercase; }
    .block-quote { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.1rem,2vw,1.5rem); font-style: italic; color: rgba(255,255,255,0.9); margin: 1rem 0; padding-left: 1.5rem; border-left: 3px solid rgba(255,255,255,0.3); }

    blockquote.block-quote { padding: 1.5rem 2rem; border-left: 4px solid rgba(232,168,56,0.7); background: rgba(0,0,0,0.25); border-radius: 0 6px 6px 0; margin: 1rem 0 1.5rem; }
    blockquote.block-quote p { font-family: 'Playfair Display', serif; font-size: clamp(1.1rem,2.5vw,1.6rem); font-style: italic; color: rgba(255,255,255,0.92); margin-bottom: 0.75rem; }
    blockquote.block-quote cite { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: rgba(232,168,56,0.8); font-style: normal; }

    .block-image { margin: 0 0 1.5rem; width: 100%; }
    .block-image img { width: 100%; height: auto; display: block; border-radius: 4px; }
    .block-image figcaption { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; }

    .block-placeholder { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.3); padding: 2rem; border: 1px dashed rgba(255,255,255,0.15); border-radius: 6px; text-align: center; margin-bottom: 1rem; }

    .align-left { text-align: left; }
    .align-center { text-align: center; margin-left: auto; margin-right: auto; }
    .align-right { text-align: right; margin-left: auto; }
  </style>
</head>
<body>
${sections}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story.title.replace(/\s+/g, '-').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

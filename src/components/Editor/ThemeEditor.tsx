import { useState } from 'react';
import type { Dispatch } from 'react';
import type { StoryTheme } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import {
  HEADING_FONTS,
  BODY_FONTS,
  loadGoogleFont,
  loadCustomFont,
  findFont,
  isCustomFont,
  customFontDisplayName,
} from '../../utils/fonts';
import styles from './ThemeEditor.module.css';

type Props = {
  theme: StoryTheme;
  dispatch: Dispatch<StoryAction>;
};

const CUSTOM_VALUE = '__custom__';

export function ThemeEditor({ theme, dispatch }: Props) {
  const update = (updates: Partial<StoryTheme>) =>
    dispatch({ type: 'UPDATE_THEME', payload: { updates } });

  const captionFont = theme.fontCaption ?? "'JetBrains Mono', monospace";

  // Lokalt state för egna typsnitt
  const [customHeading, setCustomHeading] = useState(
    isCustomFont(theme.fontHeading, HEADING_FONTS) ? customFontDisplayName(theme.fontHeading) : ''
  );
  const [customHeadingUrl, setCustomHeadingUrl] = useState(theme.fontHeadingUrl ?? '');
  const [customBody, setCustomBody] = useState(
    isCustomFont(theme.fontBody, BODY_FONTS) ? customFontDisplayName(theme.fontBody) : ''
  );
  const [customBodyUrl, setCustomBodyUrl] = useState(theme.fontBodyUrl ?? '');
  const [customCaption, setCustomCaption] = useState(
    isCustomFont(captionFont, BODY_FONTS) ? customFontDisplayName(captionFont) : ''
  );
  const [customCaptionUrl, setCustomCaptionUrl] = useState(theme.fontCaptionUrl ?? '');

  const headingIsCustom = isCustomFont(theme.fontHeading, HEADING_FONTS);
  const bodyIsCustom = isCustomFont(theme.fontBody, BODY_FONTS);
  const captionIsCustom = isCustomFont(captionFont, BODY_FONTS);

  const handleHeadingFont = (value: string) => {
    if (value === CUSTOM_VALUE) return;
    const font = findFont(value, HEADING_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontHeading: value, fontHeadingUrl: undefined });
  };

  const handleBodyFont = (value: string) => {
    if (value === CUSTOM_VALUE) return;
    const font = findFont(value, BODY_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontBody: value, fontBodyUrl: undefined });
  };

  const applyCustomHeading = () => {
    const url = customHeadingUrl.trim() || undefined;
    const css = loadCustomFont(customHeading, url);
    if (css) update({ fontHeading: css, fontHeadingUrl: url });
  };

  const applyCustomBody = () => {
    const url = customBodyUrl.trim() || undefined;
    const css = loadCustomFont(customBody, url);
    if (css) update({ fontBody: css, fontBodyUrl: url });
  };

  const handleCaptionFont = (value: string) => {
    if (value === CUSTOM_VALUE) return;
    const font = findFont(value, BODY_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontCaption: value, fontCaptionUrl: undefined });
  };

  const applyCustomCaption = () => {
    const url = customCaptionUrl.trim() || undefined;
    const css = loadCustomFont(customCaption, url);
    if (css) update({ fontCaption: css, fontCaptionUrl: url });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>TYPSNITT</span>

        {/* Rubrik-font */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Rubrik</label>
          <select
            className={styles.select}
            value={headingIsCustom ? CUSTOM_VALUE : theme.fontHeading}
            onChange={(e) => {
              if (e.target.value === CUSTOM_VALUE) {
                setCustomHeading('');
                setCustomHeadingUrl('');
                update({ fontHeading: CUSTOM_VALUE, fontHeadingUrl: undefined });
              } else {
                handleHeadingFont(e.target.value);
              }
            }}
          >
            {HEADING_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
            <option value={CUSTOM_VALUE}>Eget typsnitt…</option>
          </select>

          {headingIsCustom && (
            <div className={styles.customBlock}>
              <div className={styles.customRow}>
                <input
                  type="text"
                  className={styles.customInput}
                  placeholder="Typsnittets namn, t.ex. MyFont"
                  value={customHeading}
                  onChange={(e) => setCustomHeading(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomHeading()}
                />
              </div>
              <input
                type="url"
                className={styles.customUrlInput}
                placeholder="URL till .woff2, .css eller lämna tomt för Google Fonts"
                value={customHeadingUrl}
                onChange={(e) => setCustomHeadingUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCustomHeading()}
              />
              <button className={styles.loadBtn} onClick={applyCustomHeading}>Ladda typsnitt</button>
            </div>
          )}

          <div
            className={styles.fontPreview}
            style={{ fontFamily: headingIsCustom ? (customHeading || 'sans-serif') : theme.fontHeading }}
          >
            Aa — Rubrikfont
          </div>
        </div>

        {/* Brödtext-font */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Brödtext</label>
          <select
            className={styles.select}
            value={bodyIsCustom ? CUSTOM_VALUE : theme.fontBody}
            onChange={(e) => {
              if (e.target.value === CUSTOM_VALUE) {
                setCustomBody('');
                setCustomBodyUrl('');
                update({ fontBody: CUSTOM_VALUE, fontBodyUrl: undefined });
              } else {
                handleBodyFont(e.target.value);
              }
            }}
          >
            {BODY_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
            <option value={CUSTOM_VALUE}>Eget typsnitt…</option>
          </select>

          {bodyIsCustom && (
            <div className={styles.customBlock}>
              <div className={styles.customRow}>
                <input
                  type="text"
                  className={styles.customInput}
                  placeholder="Typsnittets namn, t.ex. MyFont"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomBody()}
                />
              </div>
              <input
                type="url"
                className={styles.customUrlInput}
                placeholder="URL till .woff2, .css eller lämna tomt för Google Fonts"
                value={customBodyUrl}
                onChange={(e) => setCustomBodyUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCustomBody()}
              />
              <button className={styles.loadBtn} onClick={applyCustomBody}>Ladda typsnitt</button>
            </div>
          )}

          <div
            className={styles.fontPreviewBody}
            style={{ fontFamily: bodyIsCustom ? (customBody || 'sans-serif') : theme.fontBody }}
          >
            Aa — Brödtextfont
          </div>
        </div>
        {/* Bildtext-font */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Bildtext</label>
          <select
            className={styles.select}
            value={captionIsCustom ? CUSTOM_VALUE : captionFont}
            onChange={(e) => {
              if (e.target.value === CUSTOM_VALUE) {
                setCustomCaption('');
                setCustomCaptionUrl('');
                update({ fontCaption: CUSTOM_VALUE, fontCaptionUrl: undefined });
              } else {
                handleCaptionFont(e.target.value);
              }
            }}
          >
            {BODY_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
            <option value={CUSTOM_VALUE}>Eget typsnitt…</option>
          </select>

          {captionIsCustom && (
            <div className={styles.customBlock}>
              <div className={styles.customRow}>
                <input
                  type="text"
                  className={styles.customInput}
                  placeholder="Typsnittets namn"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomCaption()}
                />
              </div>
              <input
                type="url"
                className={styles.customUrlInput}
                placeholder="URL till .woff2, .css eller lämna tomt för Google Fonts"
                value={customCaptionUrl}
                onChange={(e) => setCustomCaptionUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCustomCaption()}
              />
              <button className={styles.loadBtn} onClick={applyCustomCaption}>Ladda typsnitt</button>
            </div>
          )}

          <div
            className={styles.fontPreviewCaption}
            style={{ fontFamily: captionIsCustom ? (customCaption || 'monospace') : captionFont }}
          >
            Aa — Bildtextfont
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>FÄRGER</span>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Accentfärg</label>
          <div className={styles.colorRow}>
            <input
              type="color"
              className={styles.colorInput}
              value={theme.colorPrimary}
              onChange={(e) => update({ colorPrimary: e.target.value })}
            />
            <span className={styles.colorValue}>{theme.colorPrimary.toUpperCase()}</span>
            <div className={styles.colorSwatch} style={{ backgroundColor: theme.colorPrimary }} />
          </div>
          <p className={styles.colorHint}>Används för citat-accenter och diagram</p>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Textfärg (global standard)</label>
          <div className={styles.colorRow}>
            <input
              type="color"
              className={styles.colorInput}
              value={theme.colorText}
              onChange={(e) => update({ colorText: e.target.value })}
            />
            <span className={styles.colorValue}>{theme.colorText.toUpperCase()}</span>
            <div className={styles.colorSwatch} style={{ backgroundColor: theme.colorText }} />
          </div>
          <p className={styles.colorHint}>Kan overridas per sektion under "Redigera sektion"</p>
        </div>
      </div>
    </div>
  );
}

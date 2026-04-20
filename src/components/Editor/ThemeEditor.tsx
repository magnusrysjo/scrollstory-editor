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

  // Lokalt state för egna typsnittsnamn i inputfälten
  const [customHeading, setCustomHeading] = useState(
    isCustomFont(theme.fontHeading, HEADING_FONTS) ? customFontDisplayName(theme.fontHeading) : ''
  );
  const [customBody, setCustomBody] = useState(
    isCustomFont(theme.fontBody, BODY_FONTS) ? customFontDisplayName(theme.fontBody) : ''
  );

  const headingIsCustom = isCustomFont(theme.fontHeading, HEADING_FONTS);
  const bodyIsCustom = isCustomFont(theme.fontBody, BODY_FONTS);

  const handleHeadingFont = (value: string) => {
    if (value === CUSTOM_VALUE) return; // väntar på input
    const font = findFont(value, HEADING_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontHeading: value });
  };

  const handleBodyFont = (value: string) => {
    if (value === CUSTOM_VALUE) return;
    const font = findFont(value, BODY_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontBody: value });
  };

  const applyCustomHeading = () => {
    const css = loadCustomFont(customHeading);
    if (css) update({ fontHeading: css });
  };

  const applyCustomBody = () => {
    const css = loadCustomFont(customBody);
    if (css) update({ fontBody: css });
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
                update({ fontHeading: CUSTOM_VALUE });
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
            <div className={styles.customRow}>
              <input
                type="text"
                className={styles.customInput}
                placeholder="T.ex. Oswald eller Raleway"
                value={customHeading}
                onChange={(e) => setCustomHeading(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCustomHeading()}
              />
              <button className={styles.loadBtn} onClick={applyCustomHeading}>Ladda</button>
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
                update({ fontBody: CUSTOM_VALUE });
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
            <div className={styles.customRow}>
              <input
                type="text"
                className={styles.customInput}
                placeholder="T.ex. Nunito eller Roboto"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCustomBody()}
              />
              <button className={styles.loadBtn} onClick={applyCustomBody}>Ladda</button>
            </div>
          )}

          <div
            className={styles.fontPreviewBody}
            style={{ fontFamily: bodyIsCustom ? (customBody || 'sans-serif') : theme.fontBody }}
          >
            Aa — Brödtextfont
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

import type { Dispatch } from 'react';
import type { StoryTheme } from '../../types/story';
import type { StoryAction } from '../../hooks/useStory';
import { HEADING_FONTS, BODY_FONTS, loadGoogleFont, findFont } from '../../utils/fonts';
import styles from './ThemeEditor.module.css';

type Props = {
  theme: StoryTheme;
  dispatch: Dispatch<StoryAction>;
};

export function ThemeEditor({ theme, dispatch }: Props) {
  const update = (updates: Partial<StoryTheme>) =>
    dispatch({ type: 'UPDATE_THEME', payload: { updates } });

  const handleHeadingFont = (value: string) => {
    const font = findFont(value, HEADING_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontHeading: value });
  };

  const handleBodyFont = (value: string) => {
    const font = findFont(value, BODY_FONTS);
    if (font) loadGoogleFont(font);
    update({ fontBody: value });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>TYPSNITT</span>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Rubrik</label>
          <select
            className={styles.select}
            value={theme.fontHeading}
            onChange={(e) => handleHeadingFont(e.target.value)}
          >
            {HEADING_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <div className={styles.fontPreview} style={{ fontFamily: theme.fontHeading }}>
            Aa — Rubrikfont
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Brödtext</label>
          <select
            className={styles.select}
            value={theme.fontBody}
            onChange={(e) => handleBodyFont(e.target.value)}
          >
            {BODY_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <div className={styles.fontPreviewBody} style={{ fontFamily: theme.fontBody }}>
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
          <label className={styles.fieldLabel}>Textfärg</label>
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
          <p className={styles.colorHint}>Brödtextens grundfärg i preview</p>
        </div>
      </div>
    </div>
  );
}

import { Children, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type DemoPanelProps = {
  desc: string;
  note: string;
  children: ReactNode; // exactly two children: the demo-box and the code-block
};

/**
 * Shared layout for every skill-demo panel: description, a two-column
 * demo-box/code-block grid, then a closing note. Keeps all 17 demos
 * consistent without repeating the same three wrapper elements everywhere.
 *
 * Desktop (≥900px): both panes always visible side by side (demo-grid row) —
 * the mobile-only tab bar below is hidden via CSS and has no effect here.
 * Mobile/tablet (<900px): stacking live+code always-visible made the page
 * very long, so a small "Live/Code" tab bar switches between them instead —
 * same two children, just one shown at a time via CSS on narrow viewports.
 */
export default function DemoPanel({ desc, note, children }: DemoPanelProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState<0 | 1>(0);
  const [live, code] = Children.toArray(children);

  return (
    <>
      <p className="tab-desc">{desc}</p>
      <div className="demo-tabs-mobile-bar" role="tablist">
        <button
          className={'demo-tab-btn' + (active === 0 ? ' active' : '')}
          role="tab"
          aria-selected={active === 0}
          onClick={() => setActive(0)}
        >
          {t('common.live')}
        </button>
        <button
          className={'demo-tab-btn' + (active === 1 ? ' active' : '')}
          role="tab"
          aria-selected={active === 1}
          onClick={() => setActive(1)}
        >
          {t('common.code')}
        </button>
      </div>
      <div className="demo-grid">
        <div className={'demo-grid-cell' + (active === 0 ? ' active' : '')}>{live}</div>
        <div className={'demo-grid-cell' + (active === 1 ? ' active' : '')}>{code}</div>
      </div>
      <div className="demo-note">{note}</div>
    </>
  );
}

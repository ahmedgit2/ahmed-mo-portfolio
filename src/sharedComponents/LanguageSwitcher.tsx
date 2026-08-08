import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

/** Compact language picker — globe icon + current language name, dropdown with a checkmark on the active one. */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        className="lang-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>{current.label}</span>
        <svg className="lang-switcher-chevron" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 3l3.5 3L8 3" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="listbox">
          {SUPPORTED_LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                className={'lang-switcher-option' + (l.code === current.code ? ' active' : '')}
                role="option"
                aria-selected={l.code === current.code}
                onClick={() => { i18n.changeLanguage(l.code); setOpen(false); }}
              >
                <span className="lang-switcher-check">{l.code === current.code ? '✓' : ''}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

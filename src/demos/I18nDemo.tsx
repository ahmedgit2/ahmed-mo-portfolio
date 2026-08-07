import { useState } from 'react';

const STRINGS: Record<string, string> = {
  en: 'Welcome back — you have 3 new updates.',
  ar: 'مرحبًا بعودتك — لديك 3 تحديثات جديدة.',
  de: 'Willkommen zurück — du hast 3 neue Updates.',
};

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
];

export default function I18nDemo() {
  const [lang, setLang] = useState('en');
  const isRtl = lang === 'ar';

  return (
    <>
      <p className="tab-desc">Multi-locale support via i18next and react-native-localize, including RTL for Arabic.</p>
      <div className="demo-grid">
        <div className="demo-box">
          <div className="cta-row" style={{ marginTop: 0 }}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={'btn ' + (lang === l.code ? 'btn-primary' : 'btn-ghost')}
                style={{ padding: '9px 16px' }}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 18, fontSize: 15, direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
            {STRINGS[lang]}
          </p>
        </div>
        <pre className="code-block">{`const { t } = useTranslation();
<Text>{t('welcome_updates', { count: 3 })}</Text>

// ar.json
{ "welcome_updates": "مرحبًا بعودتك — لديك {{count}} تحديثات." }

I18nManager.forceRTL(isRTL);`}</pre>
      </div>
      <div className="demo-note">// react-native-localize detects device locale; I18nManager flips layout direction.</div>
    </>
  );
}

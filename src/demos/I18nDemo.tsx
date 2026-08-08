import { useState } from 'react';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

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
    <DemoPanel
      desc="Multi-locale support via i18next and react-native-localize, including RTL for Arabic."
      note="// react-native-localize detects device locale; I18nManager flips layout direction."
    >
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
      <CodeTabs
        files={[
          {
            name: 'i18n.ts',
            code: `// i18next config — pluralization + interpolation, not just flat key lookup
i18next.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar }, de: { translation: de } },
  lng: RNLocalize.getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

const { t } = useTranslation();
<Text>{t('welcome_updates', { count: unreadCount })}</Text>`,
          },
          {
            name: 'ar.json',
            code: `{
  "welcome_updates_one": "مرحبًا بعودتك — لديك تحديث واحد.",
  "welcome_updates_other": "مرحبًا بعودتك — لديك {{count}} تحديثات."
}
// i18next picks the plural form automatically from the {{count}} passed in —
// Arabic has 6 plural forms, i18next-icu handles the ones this project needs`,
          },
          {
            name: 'useLocaleDirection.ts',
            code: `// RTL isn't just text direction — layout, icons, and gestures all flip
export function applyLocaleDirection(languageCode: string) {
  const isRTL = ['ar', 'he', 'ur'].includes(languageCode);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    RNRestart.restart(); // layout direction only applies on next launch
  }
}

// caught in QA: flex-direction: 'row' assumptions broke in RTL —
// switched to marginStart/marginEnd and I18nManager.isRTL checks instead
// of hardcoded left/right throughout the design system components.`,
          },
        ]}
      />
    </DemoPanel>
  );
}

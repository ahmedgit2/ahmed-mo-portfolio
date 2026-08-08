import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

// Tool/library names are proper nouns — never translated. Only group titles
// and the two prose descriptions come from the translation files, matched by index.
const PILLS: string[][] = [
  ['React Native CLI', 'Expo', 'TypeScript', 'JavaScript ES6+', 'Bare Workflow'],
  ['Fabric', 'TurboModules', 'JSI', 'Hermes', 'Swift/Kotlin Bridging'],
  ['XCFramework', 'Android AAR', 'Versioned Binary Distribution'],
  ['React Navigation', 'Reanimated v2/v3', 'Community UI Libs'],
  ['Redux Toolkit', 'Redux Persist', 'Context API'],
  ['REST APIs', 'JSON:API', 'React Query', 'Axios', 'WebSockets'],
  ['MMKV', 'AsyncStorage', 'Offline-First', 'Keychain/Keystore'],
  ['Jest', 'RN Testing Library', 'Flipper', 'Profiling', 'Memoization'],
  ['GitLab CI/CD', 'GitHub Actions', 'EAS Build', 'TestFlight', 'Play Console'],
  ['Firebase', 'Crashlytics', 'FCM', 'SQL'],
  ['Claude Code', 'Cursor AI', 'GitHub Copilot', 'CodePush', 'ESLint/Prettier'],
  ['i18next', 'react-native-localize'],
  ['Agile/Scrum', 'Sprint Planning', 'Code Reviews', 'Cross-Functional Collab'],
  ['react-native-tvos', 'tvOS', 'Android TV', 'Focus Management', 'Spatial Navigation', 'watchOS', 'Wear OS', 'Native Bridge', 'Companion Apps'],
  ['React.js', 'Next.js (fundamentals)', 'SSR', 'Web'],
];

type SkillGroupText = { title: string; desc?: string };

export default function Skills() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const groups = t('skills.groups', { returnObjects: true }) as SkillGroupText[];

  return (
    <section id="skills">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <div className="sec-head">
          <h2>{t('skills.heading')}</h2>
          <p className="sec-sub">{t('skills.subheading')}</p>
        </div>
        <div className="skills-grid">
          {groups.map((g, i) => (
            <div className="skill-group" key={g.title}>
              <h3>{g.title}</h3>
              {g.desc && <p className="skill-desc">{g.desc}</p>}
              <div className="pill-row">
                {PILLS[i].map((p) => <span className="pill" key={p}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

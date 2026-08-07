type SkillGroup = { title: string; pills: string[]; desc?: string };

const GROUPS: SkillGroup[] = [
  { title: 'Core Framework & Languages', pills: ['React Native CLI', 'Expo', 'TypeScript', 'JavaScript ES6+', 'Bare Workflow'] },
  { title: 'New Architecture & Native', pills: ['Fabric', 'TurboModules', 'JSI', 'Hermes', 'Swift/Kotlin Bridging'] },
  { title: 'Native Packaging', pills: ['XCFramework', 'Android AAR', 'Versioned Binary Distribution'] },
  { title: 'UI, Navigation & Lists', pills: ['React Navigation', 'Reanimated v2/v3', 'Community UI Libs'] },
  { title: 'State Management', pills: ['Redux Toolkit', 'Redux Persist', 'Context API'] },
  { title: 'Data & Real-Time', pills: ['REST APIs', 'JSON:API', 'React Query', 'Axios', 'WebSockets'] },
  { title: 'Storage & Security', pills: ['MMKV', 'AsyncStorage', 'Offline-First', 'Keychain/Keystore'] },
  { title: 'Testing & Performance', pills: ['Jest', 'RN Testing Library', 'Flipper', 'Profiling', 'Memoization'] },
  { title: 'DevOps & Release', pills: ['GitLab CI/CD', 'GitHub Actions', 'EAS Build', 'TestFlight', 'Play Console'] },
  { title: 'Cloud & Backend', pills: ['Firebase', 'Crashlytics', 'FCM', 'SQL'] },
  { title: 'Tools & AI-Assisted Dev', pills: ['Claude Code', 'Cursor AI', 'GitHub Copilot', 'CodePush', 'ESLint/Prettier'] },
  { title: 'Localization', pills: ['i18next', 'react-native-localize'] },
  { title: 'Ways of Working', pills: ['Agile/Scrum', 'Sprint Planning', 'Code Reviews', 'Cross-Functional Collab'] },
  {
    title: 'Multi-Device Integration',
    desc: 'Comfortable with expanding React Native applications to Smart TV and Wearables using platform forks (react-native-tvos), focus controls, and Native Bridge / Companion App architecture for watchOS & Wear OS.',
    pills: ['react-native-tvos', 'tvOS', 'Android TV', 'Focus Management', 'Spatial Navigation', 'watchOS', 'Wear OS', 'Native Bridge', 'Companion Apps'],
  },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <div className="sec-head">
          <h2>Skills</h2>
          <p className="sec-sub">What I reach for day to day.</p>
        </div>
        <div className="skills-grid">
          {GROUPS.map((g) => (
            <div className="skill-group" key={g.title}>
              <h3>{g.title}</h3>
              {g.desc && <p className="skill-desc">{g.desc}</p>}
              <div className="pill-row">
                {g.pills.map((p) => <span className="pill" key={p}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

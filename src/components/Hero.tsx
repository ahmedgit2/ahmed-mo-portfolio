const LAYERS = [
  { name: 'Native host app', detail: 'iOS/Android shell app that embeds the RN module', tag: 'Swift · Kotlin · Xcode/Gradle' },
  { name: 'JS / TypeScript layer', detail: 'Screens, hooks, navigation — where features actually get built', tag: 'screens · hooks · navigation' },
  { name: 'State & data', detail: 'Client state, server cache, and real-time sync', tag: 'Redux Toolkit · React Query · WebSockets' },
  { name: 'New Architecture bridge', detail: 'Synchronous JS↔native calls, no serialization overhead', tag: 'Fabric · TurboModules · JSI' },
  { name: 'Native binaries', detail: 'Versioned, decoupled from host app toolchains', tag: 'XCFramework · AAR' },
  { name: 'Persistence', detail: 'Encrypted local storage, offline-first queueing', tag: 'MMKV · Keychain/Keystore' },
];

const STATS = [
  { num: '6 yrs', label: 'software engineering' },
  { num: '6', label: 'apps shipped to production' },
  { num: '1,500+', label: 'commits across 200+ tickets' },
];

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="eyebrow">Senior React Native Engineer · Cairo, Egypt</div>
        <h1>
          I build the layer where
          <br />
          JavaScript meets <span className="accent">native</span>.
        </h1>
        <p className="tagline">
          6 years in software engineering, 5 shipping production React Native apps — specializing in
          native binary architecture, cross-platform performance, and the boring-but-critical work of
          making JS and native code talk to each other cleanly.
        </p>

        {/* Quick take for non-technical readers (recruiters) — skimmable in 2 seconds */}
        <div className="stat-strip">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="cta-row">
          <a className="btn btn-primary" href="#demos">See it in action</a>
          <a className="btn btn-ghost" href="mailto:ahmedmoh6000@gmail.com">Get in touch</a>
        </div>

        {/* Deeper technical detail for engineers reviewing the stack */}
        <div
          className="stack"
          role="img"
          aria-label="Diagram of React Native architecture layers: JavaScript, the New Architecture bridge, and native binaries."
        >
          <div className="stack-label">Where I work</div>
          {LAYERS.map((layer) => (
            <div className="layer" key={layer.name}>
              <div>
                <span className="layer-name">{layer.name}</span>
                <div className="layer-detail">{layer.detail}</div>
              </div>
              <span className="layer-tag">{layer.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

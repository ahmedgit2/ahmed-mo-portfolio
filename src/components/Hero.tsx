const LAYERS = [
  { name: 'Native host app', detail: 'iOS/Android shell app that embeds the RN module', tag: 'Swift · Kotlin · Xcode/Gradle' },
  { name: 'JS / TypeScript layer', detail: 'Screens, hooks, navigation — where features actually get built', tag: 'screens · hooks · navigation' },
  { name: 'State & data', detail: 'Client state, server cache, and real-time sync', tag: 'Redux Toolkit · React Query · WebSockets' },
  { name: 'New Architecture bridge', detail: 'Synchronous JS↔native calls, no serialization overhead', tag: 'Fabric · TurboModules · JSI' },
  { name: 'Native binaries', detail: 'Versioned, decoupled from host app toolchains', tag: 'XCFramework · AAR' },
  { name: 'Persistence', detail: 'Encrypted local storage, offline-first queueing', tag: 'MMKV · Keychain/Keystore' },
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
          Senior React Native Developer with <span className="accent">6 years</span> of software
          engineering experience, including 5 years building production mobile applications across
          enterprise SaaS (construction), e-commerce, and logistics. Beyond core React Native, I bring
          hands-on expertise in native iOS and Android integration — Swift/Kotlin, custom native
          modules, versioned native binaries, and embedded RN host architectures. I specialize in
          performance optimization, New Architecture adoption, and codebase standardization, including
          architecting modular container patterns adopted across enterprise applications. Focused on
          delivering high-impact, test-backed mobile solutions, with long-term aspirations of growing
          into a Team Lead role.
        </p>

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

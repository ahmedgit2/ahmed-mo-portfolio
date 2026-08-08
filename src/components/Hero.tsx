import { useReveal } from '../hooks/useReveal';

const LAYERS = [
  { name: 'Native host app', detail: 'iOS/Android shell app that embeds the RN module as a versioned binary', tag: 'Swift · Kotlin · Xcode/Gradle' },
  { name: 'Container architecture', detail: 'Screens → HOCs → hooks/helpers — the reusable pattern I established, adopted across modals and navigation', tag: 'HOCs · hooks · Animated API' },
  { name: 'AI Assistant', detail: 'WebSocket-streamed LLM responses with native-bridge actions for ticket navigation and filters', tag: 'WebSockets · native bridge · LLM streaming' },
  { name: 'State & real-time data', detail: "Domain-specific contexts split from a monolithic RootContext; powers the DMS module's offline-first sync", tag: 'Context API · React Query · JSON:API' },
  { name: 'New Architecture bridge', detail: 'Hermes + TurboModules/Fabric — synchronous JS↔native calls, no serialization overhead', tag: 'Fabric · TurboModules · JSI' },
  { name: 'Native binaries', detail: 'Versioned XCFramework + AAR, decoupled from native host toolchains', tag: 'XCFramework · AAR' },
  { name: 'Persistence', detail: 'Migrated from AsyncStorage to MMKV — encrypted, synchronous, offline-first queueing', tag: 'MMKV · Keychain/Keystore' },
];

export default function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();
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
          Senior React Native Developer with <b className="accent">6 years</b> of software engineering
          experience, including <b className="accent">5 years</b> building production mobile applications
          across enterprise SaaS (construction), e-commerce, and logistics. Beyond core React Native, I
          bring hands-on expertise in <b className="accent">native iOS and Android integration</b> —
          Swift/Kotlin, custom native modules, versioned native binaries, and embedded RN host
          architectures. I specialize in performance optimization, <b className="accent">New Architecture</b>{' '}
          adoption, and codebase standardization, including architecting modular container patterns
          adopted across enterprise applications. Focused on delivering high-impact, test-backed mobile
          solutions, with long-term aspirations of growing into a <b className="accent">Team Lead</b> role.
        </p>

        <div className="cta-row">
          <a className="btn btn-primary" href="#demos">See it in action</a>
          <a className="btn btn-ghost" href="mailto:ahmedmoh6000@gmail.com">Get in touch</a>
        </div>

        {/* Deeper technical detail for engineers reviewing the stack */}
        <div
          className={'stack reveal' + (visible ? ' visible' : '')}
          ref={ref}
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

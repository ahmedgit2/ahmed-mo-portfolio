import { useState } from 'react';

const LINKS = [
  { label: 'geet://order/8842', route: '→ resolves to OrderDetails, orderId: 8842' },
  { label: 'geet://driver/119', route: '→ resolves to DriverProfile, driverId: 119' },
  { label: 'geet://unknown/xyz', route: '→ no match — getStateFromPath falls back to Home' },
];

export default function DeepLinkDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <p className="tab-desc">At Index Group, notifications and shared links opened the app directly to a specific order or driver screen.</p>
      <div className="demo-grid">
        <div className="demo-box">
          <div className="fake-list">
            {LINKS.map((l, i) => (
              <div
                key={l.label}
                className={'fake-row' + (i === selected ? ' selected' : '')}
                onClick={() => setSelected(i)}
              >
                {l.label}
              </div>
            ))}
          </div>
          <div className="demo-note" style={{ marginTop: 14 }}>
            {selected === null ? 'Pick a link to resolve it →' : LINKS[selected].route}
          </div>
        </div>
        <pre className="code-block">{`const linking = {
  prefixes: ['geet://'],
  config: { screens: {
    OrderDetails: 'order/:orderId',
    DriverProfile: 'driver/:driverId',
    Chat: 'chat/:threadId'
  }},
  // fallback when no matching route
  getStateFromPath: (path, options) => {
    try { return getStateFromPath(path, options); }
    catch { return undefined; } // → Home
  }
};`}</pre>
      </div>
      <div className="demo-note">// Unmatched paths fall back to a default route instead of crashing the navigator.</div>
    </>
  );
}

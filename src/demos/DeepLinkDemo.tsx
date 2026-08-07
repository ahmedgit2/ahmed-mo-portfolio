import { useState } from 'react';
import DemoPanel from './DemoPanel';

const LINKS = [
  { label: 'geet://order/8842', route: '→ resolves to OrderDetails, orderId: 8842' },
  { label: 'geet://driver/119', route: '→ resolves to DriverProfile, driverId: 119' },
  { label: 'geet://unknown/xyz', route: '→ no match — getStateFromPath falls back to Home' },
];

export default function DeepLinkDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <DemoPanel
      desc="At Index Group, notifications and shared links opened the app directly to a specific order or driver screen."
      note="// Unmatched paths fall back to a default route instead of crashing the navigator."
    >
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
      <pre className="code-block">{`const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['geet://', 'https://geet.app'], // custom scheme + Universal Link host
  config: {
    screens: {
      OrderDetails: { path: 'order/:orderId', parse: { orderId: Number } },
      DriverProfile: { path: 'driver/:driverId', parse: { driverId: Number } },
      Chat: 'chat/:threadId',
      NotFound: '*', // catch-all, kept out of getStateFromPath below
    },
  },
  // an unmatched path shouldn't crash the navigator or leave a blank screen
  getStateFromPath: (path, options) => {
    try {
      const state = getStateFromPath(path, options);
      return state ?? buildInitialState('Home');
    } catch (err) {
      logger.warn('deep link failed to resolve', { path, err });
      return buildInitialState('Home');
    }
  },
  // cold start: app opened directly from a link, not a running instance
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;
    const message = await messaging().getInitialNotification();
    return message?.data?.link ?? null; // push notifications also carry deep links
  },
};`}</pre>
    </DemoPanel>
  );
}

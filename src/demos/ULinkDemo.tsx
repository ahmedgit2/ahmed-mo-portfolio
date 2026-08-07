import { useRef, useState } from 'react';
import DemoPanel from './DemoPanel';

const STEPS = [
  'iOS: user taps https://geet.app/order/8842',
  'System checks apple-app-site-association on geet.app',
  'App ID matches installed app → opens natively, no Safari hop',
  'RN linking config resolves to OrderDetails, orderId: 8842 ✓',
];

export default function ULinkDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLines([]);
    STEPS.forEach((step, i) => {
      const id = window.setTimeout(() => setLines((prev) => [...prev, step]), i * 450);
      timers.current.push(id);
    });
  }

  return (
    <DemoPanel
      desc="Universal Links (iOS) and App Links (Android) skip the custom-scheme prompt entirely — a real https:// link opens the app directly if it's installed, or the web page if not."
      note="// No installed app → same URL opens the mobile web fallback instead."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={run}>Open https://geet.app/order/8842</button>
        <div className="bridge-log" style={{ marginTop: 14, minHeight: STEPS.length * 23 }}>
          {lines.length === 0 && 'Simulates iOS resolving the link →'}
          {lines.map((line, i) => (
            <div key={line} className={i === STEPS.length - 1 ? 'ok' : 'cur'}>{line}</div>
          ))}
        </div>
      </div>
      <pre className="code-block">{`// apple-app-site-association (hosted on geet.app)
{
  "applinks": { "details": [{
    "appID": "TEAMID.com.geet.app",
    "paths": [ "/order/*", "/driver/*" ]
  }]}
}

// Xcode: Associated Domains capability
applinks:geet.app

// Android: assetlinks.json + intent-filter
<intent-filter android:autoVerify="true">
  <data android:scheme="https" android:host="geet.app"/>
</intent-filter>`}</pre>
    </DemoPanel>
  );
}

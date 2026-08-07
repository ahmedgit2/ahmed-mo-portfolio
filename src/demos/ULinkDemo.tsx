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
      <pre className="code-block">{`// apple-app-site-association — served at
// https://geet.app/.well-known/apple-app-site-association, no extension, no redirect
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.geet.app",
      "paths": ["/order/*", "/driver/*", "NOT /admin/*"]
    }]
  }
}

// Xcode: Associated Domains capability (per environment)
applinks:geet.app
applinks:staging.geet.app

// Android: /.well-known/assetlinks.json + manifest intent-filter
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="geet.app" />
</intent-filter>

// caught in review once: staging builds pointed at the prod AASA file,
// so TestFlight links silently opened production data. Split by scheme
// and verify assetlinks.json / AASA per environment in CI before release.`}</pre>
    </DemoPanel>
  );
}

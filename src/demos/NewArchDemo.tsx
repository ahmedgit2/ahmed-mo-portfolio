import { useRef, useState } from 'react';
import DemoPanel from './DemoPanel';

const STEPS: { text: string; kind: 'ok' | 'cur' }[] = [
  { text: 'Old bridge: serialize args → JSON', kind: 'cur' },
  { text: 'Old bridge: queue → native thread → deserialize', kind: 'cur' },
  { text: 'Old bridge: result ≈ 40ms round trip', kind: 'cur' },
  { text: 'JSI: direct call, no queue, no serialize', kind: 'cur' },
  { text: 'JSI: result ≈ 0.6ms round trip ✓', kind: 'ok' },
];

export default function NewArchDemo() {
  const [lines, setLines] = useState<typeof STEPS>([]);
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
      desc="Led PlanRadar's migration to React Native 0.85 — Hermes + New Architecture. JSI replaces the old async, JSON-serialized bridge with direct synchronous native calls. Click to compare."
      note="// JSI gives JS a direct reference to native objects — no serialize/queue/deserialize round trip."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={run}>Call native module: getBatteryLevel()</button>
        <div className="bridge-log" style={{ minHeight: STEPS.length * 23 }}>
          {lines.length === 0 && 'Run it on the old bridge, then on JSI →'}
          {lines.map((line, i) => <div key={i} className={line.kind}>{line.text}</div>)}
        </div>
      </div>
      <pre className="code-block">{`// Old bridge — async, JSON-serialized
NativeModules.Battery.getLevel(
  (level) => setLevel(level)
); // ~40ms round trip

// TurboModule + JSI — sync, direct
import Battery from './NativeBattery';
const level = Battery.getLevel(); // <1ms, no bridge`}</pre>
    </DemoPanel>
  );
}

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
      <pre className="code-block">{`// Old architecture — every call crosses the bridge as a JSON string
NativeModules.DocumentIndexer.checkStatus(
  documentId,
  (status) => setIndexStatus(status),
  (error) => logger.error(error),
); // args + return value both serialized, queued, deserialized — ~30-50ms

// New Architecture — TurboModule spec, codegen'd from a TypeScript interface
export interface Spec extends TurboModule {
  checkStatus(documentId: string): string; // sync, returns directly
  subscribeToIndexUpdates(callback: (event: IndexEvent) => void): void;
}
export default TurboModuleRegistry.getEnforcing<Spec>('DocumentIndexer');

// JSI gives JS a direct pointer to the native HostObject —
// no bridge queue, no JSON.stringify/parse, callable synchronously
import DocumentIndexer from './NativeDocumentIndexer';
const status = DocumentIndexer.checkStatus(documentId); // <1ms

// migration reality: 40+ third-party native modules had to be audited —
// some shipped Fabric-compatible versions, a few we forked and patched
// ourselves to unblock the 0.85 upgrade before submitting PRs upstream.`}</pre>
    </DemoPanel>
  );
}

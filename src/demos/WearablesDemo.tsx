import { useRef, useState } from 'react';
import DemoPanel from './DemoPanel';

const STEPS: { text: string; kind: 'ok' | 'cur' }[] = [
  { text: 'RN: WCSession.sendMessage({ orderStatus: "approved" })', kind: 'cur' },
  { text: 'watchOS: WatchConnectivity delivers message to companion app', kind: 'cur' },
  { text: 'Wear OS: MessageClient delivers to companion app (Android path)', kind: 'cur' },
  { text: '✓ Watch face updated — no round trip through the phone UI', kind: 'ok' },
];

export default function WearablesDemo() {
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
      desc="Wearables (watchOS, Wear OS) pair over a native companion bridge, not a shrunk-down RN screen. No shipped production app yet — architecture below is how I'd approach it."
      note="// The bridge is native-to-native — RN only sends the payload, the watch app renders it."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={run}>Send status to watch</button>
        <div className="bridge-log">
          {lines.length === 0 && 'Simulates the native companion bridge round trip →'}
          {lines.map((line, i) => <div key={i} className={line.kind}>{line.text}</div>)}
        </div>
      </div>
      <pre className="code-block">{`// Wearable — native companion bridge
WCSession.sendMessage(
  { orderStatus: 'approved' },
  (reply) => {}, (err) => {}
); // watchOS via WatchConnectivity

// Android equivalent
Wearable.getMessageClient(context)
  .sendMessage(nodeId, '/order-status', payload);
  // Wear OS via MessageClient`}</pre>
    </DemoPanel>
  );
}

import { useRef, useState } from 'react';
import DemoPanel from './DemoPanel';

type LogLine = { text: string; kind: 'ok' | 'cur' };

const FLOWS: Record<'send' | 'receive', { label: string; steps: LogLine[] }> = {
  send: {
    label: 'Send status to watch',
    steps: [
      { text: 'RN: WCSession.sendMessage({ orderStatus: "approved" })', kind: 'cur' },
      { text: 'watchOS: WatchConnectivity delivers message to companion app', kind: 'cur' },
      { text: 'Wear OS: MessageClient delivers to companion app (Android path)', kind: 'cur' },
      { text: '✓ Watch face updated — no round trip through the phone UI', kind: 'ok' },
    ],
  },
  receive: {
    label: 'Receive tap from watch',
    steps: [
      { text: 'Watch: user taps "Approve" complication on their wrist', kind: 'cur' },
      { text: 'watchOS/Wear OS: companion app sends action back over the bridge', kind: 'cur' },
      { text: 'RN: session.onMessage fires with { action: "approve", id }', kind: 'cur' },
      { text: '✓ Same handler the phone UI uses — one source of truth', kind: 'ok' },
    ],
  },
};

// Sized to the longer flow's line count so the box never jumps between examples.
const MAX_STEPS = Math.max(...Object.values(FLOWS).map((f) => f.steps.length));
const LOG_MIN_HEIGHT = MAX_STEPS * 23;

export default function WearablesDemo() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const timers = useRef<number[]>([]);

  function run(flow: 'send' | 'receive') {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLines([]);
    FLOWS[flow].steps.forEach((step, i) => {
      const id = window.setTimeout(() => setLines((prev) => [...prev, step]), i * 450);
      timers.current.push(id);
    });
  }

  return (
    <DemoPanel
      desc="Wearables (watchOS, Wear OS) pair over a native companion bridge, not a shrunk-down RN screen — both directions. No shipped production app yet — architecture below is how I'd approach it."
      note="// The bridge is native-to-native — RN only sends/receives the payload, the watch app renders it."
    >
      <div className="demo-box" style={{ alignSelf: 'stretch' }}>
        <div className="cta-row" style={{ marginTop: 0, marginBottom: 14 }}>
          <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={() => run('send')}>{FLOWS.send.label}</button>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => run('receive')}>{FLOWS.receive.label}</button>
        </div>
        <div className="bridge-log" style={{ minHeight: LOG_MIN_HEIGHT }}>
          {lines.length === 0 && 'Simulates the native companion bridge, either direction →'}
          {lines.map((line, i) => <div key={i} className={line.kind}>{line.text}</div>)}
        </div>
      </div>
      <pre className="code-block">{`// RN → Watch — native module wraps WatchConnectivity (iOS) behind one JS API
class WatchBridge extends NativeEventEmitter {
  sendOrderStatus(orderId: string, status: OrderStatus) {
    if (Platform.OS === 'ios') {
      WCSessionModule.sendMessage({ orderId, status }, (reply) => {
        analytics.track('watch_message_delivered', { orderId });
      }, (err) => logger.warn('watch unreachable, will retry on wake', err));
    } else {
      WearableModule.sendMessage(this.connectedNodeId, '/order-status',
        JSON.stringify({ orderId, status }));
    }
  }
}

// Watch → RN — one handler regardless of which platform triggered it
watchBridge.addListener('watchAction', (payload: { action: string; orderId: string }) => {
  handleOrderAction(payload.orderId, payload.action); // same reducer as the phone UI
});

// complication data (the glanceable watch-face text) is pushed separately —
// it has its own budget/refresh-rate limits, can't just piggyback the message API
CLKComplicationServer.reloadTimeline(complicationDescriptor);`}</pre>
    </DemoPanel>
  );
}

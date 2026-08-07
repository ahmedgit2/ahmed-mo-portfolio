import { useState } from 'react';

export default function SyncDemo() {
  const [isOnline, setIsOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const [log, setLog] = useState<{ text: string; kind: 'ok' | 'cur' } | null>(null);

  function toggleOnline() {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    if (nextOnline && queued > 0) {
      setLog({ text: `↺ Reconnected — flushing ${queued} queued action(s)...`, kind: 'ok' });
      setQueued(0);
    }
  }

  function handleAction() {
    if (isOnline) {
      setLog({ text: '✓ Sent over WebSocket — approved instantly', kind: 'ok' });
    } else {
      setQueued((q) => q + 1);
      setLog({ text: `⏸ Offline — action queued (${queued + 1})`, kind: 'cur' });
    }
  }

  return (
    <>
      <p className="tab-desc">
        PlanRadar's DMS module is offline-first and real-time over WebSockets — actions queue while
        offline and flush on reconnect. Toggle offline below and make changes.
      </p>
      <div className="demo-grid">
        <div className="demo-box">
          <div className="toggle-row">
            <div className={'toggle' + (!isOnline ? ' on' : '')} onClick={toggleOnline} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}>{isOnline ? 'Online' : 'Offline'}</span>
            {queued > 0 && <span className="queue-badge">{queued} queued</span>}
          </div>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={handleAction}>Approve document</button>
          <div className="bridge-log" style={{ marginTop: 14 }}>
            {log ? <div className={log.kind}>{log.text}</div> : 'Actions will log here →'}
          </div>
        </div>
        <pre className="code-block">{`const ws = new WebSocket(url);
const queue = useOfflineQueue();

function approveDoc(id) {
  if (!isOnline) {
    return queue.push({ type: 'APPROVE', id });
  }
  ws.send(JSON.stringify({ action: 'APPROVE', id }));
}

// on reconnect: flush queue in order
ws.onopen = () => queue.flush(ws);`}</pre>
      </div>
      <div className="demo-note">// Queued actions flush in order once the socket reconnects.</div>
    </>
  );
}

import { useState } from 'react';
import DemoPanel from './shared/DemoPanel';
import CodeTabs from './shared/CodeTabs';

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
    <DemoPanel
      desc="One of PlanRadar's core modules is offline-first and real-time over WebSockets — actions queue while offline and flush on reconnect. Toggle offline below and make changes."
      note="// Queued actions flush in order once the socket reconnects."
    >
      <div className="demo-box">
        <div className="toggle-row">
          <div className={'toggle' + (!isOnline ? ' on' : '')} onClick={toggleOnline} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}>{isOnline ? 'Online' : 'Offline'}</span>
          {queued > 0 && <span className="queue-badge">{queued} queued</span>}
        </div>
        <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={handleAction}>Approve item</button>
        <div className="bridge-log" style={{ marginTop: 14 }}>
          {log ? <div className={log.kind}>{log.text}</div> : 'Actions will log here →'}
        </div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'OfflineQueue.ts',
            code: `type QueuedAction = { id: string; type: 'APPROVE' | 'REJECT'; itemId: string; ts: number };

// queue persisted to MMKV, not memory — survives an app kill mid-offline
export class OfflineQueue {
  private storage = new MMKV({ id: 'offline-queue' });

  push(action: Omit<QueuedAction, 'ts'>) {
    const queued = this.getAll();
    queued.push({ ...action, ts: Date.now() });
    this.storage.set('actions', JSON.stringify(queued));
  }

  getAll(): QueuedAction[] {
    return JSON.parse(this.storage.getString('actions') ?? '[]');
  }

  async flush(ws: WebSocket) {
    for (const action of this.getAll()) {
      ws.send(JSON.stringify(action)); // in original order, oldest first
      await waitForAck(action.id);     // server ack before next, avoids reorder
    }
    this.storage.delete('actions');
  }
}`,
          },
          {
            name: 'useItemApproval.ts',
            code: `const queue = new OfflineQueue();

export function useItemApproval() {
  const socket = useRealtimeSocket();
  const [wasOffline, setWasOffline] = useState(false);

  function approveItem(itemId: string) {
    const action = { id: uuid(), type: 'APPROVE' as const, itemId };
    if (!networkState.isOnline) return queue.push(action);
    socket.send(JSON.stringify(action));
  }

  useEffect(() => {
    // NetInfo listener drives both the offline banner and the flush trigger
    return NetInfo.addEventListener(({ isConnected }) => {
      if (isConnected && wasOffline) queue.flush(socket);
      setWasOffline(!isConnected);
    });
  }, [socket, wasOffline]);

  return { approveItem };
}`,
          },
        ]}
      />
    </DemoPanel>
  );
}

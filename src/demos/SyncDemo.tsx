import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import type { LogLine } from '../sharedComponents/useStagedLog';

export default function SyncDemo() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const [log, setLog] = useState<LogLine | null>(null);

  function toggleOnline() {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    if (nextOnline && queued > 0) {
      setLog({ text: t('demoUI.sync.logReconnected', { count: queued }), kind: 'ok' });
      setQueued(0);
    }
  }

  function handleAction() {
    if (isOnline) {
      setLog({ text: t('demoUI.sync.logSent'), kind: 'ok' });
    } else {
      setQueued((q) => q + 1);
      setLog({ text: t('demoUI.sync.logQueued', { count: queued + 1 }), kind: 'cur' });
    }
  }

  return (
    <DemoPanel
      desc={t('demoText.sync.desc')}
      note={t('demoText.sync.note')}
    >
      <div className="demo-box">
        <div className="toggle-row">
          <div className={'toggle' + (!isOnline ? ' on' : '')} onClick={toggleOnline} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}>{isOnline ? t('demoUI.sync.online') : t('demoUI.sync.offline')}</span>
          {queued > 0 && <span className="queue-badge">{t('demoUI.sync.queuedBadge', { count: queued })}</span>}
        </div>
        <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={handleAction}>{t('demoUI.sync.approveButton')}</button>
        <BridgeLog lines={log ? [log] : []} placeholder={t('demoUI.sync.logPlaceholder')} style={{ marginTop: 14 }} />
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

import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

// Sized to the longer flow's line count (4) so the box never jumps between examples.
const MAX_STEPS = 4;
const LOG_MIN_HEIGHT = MAX_STEPS * 23;

export default function WearablesDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(450);

  const FLOWS: Record<'send' | 'receive', { label: string; steps: LogLine[] }> = {
    send: {
      label: t('demoUI.wearables.sendLabel'),
      steps: [
        { text: t('demoUI.wearables.sendStep1'), kind: 'cur' },
        { text: t('demoUI.wearables.sendStep2'), kind: 'cur' },
        { text: t('demoUI.wearables.sendStep3'), kind: 'cur' },
        { text: t('demoUI.wearables.sendStep4'), kind: 'ok' },
      ],
    },
    receive: {
      label: t('demoUI.wearables.receiveLabel'),
      steps: [
        { text: t('demoUI.wearables.receiveStep1'), kind: 'cur' },
        { text: t('demoUI.wearables.receiveStep2'), kind: 'cur' },
        { text: t('demoUI.wearables.receiveStep3'), kind: 'cur' },
        { text: t('demoUI.wearables.receiveStep4'), kind: 'ok' },
      ],
    },
  };

  return (
    <DemoPanel
      desc={t('demoText.wearables.desc')}
      note={t('demoText.wearables.note')}
    >
      <div className="demo-box" style={{ alignSelf: 'stretch' }}>
        <div className="cta-row" style={{ marginTop: 0, marginBottom: 14 }}>
          <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={() => run(FLOWS.send.steps)}>{FLOWS.send.label}</button>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => run(FLOWS.receive.steps)}>{FLOWS.receive.label}</button>
        </div>
        <BridgeLog lines={lines} placeholder={t('demoUI.wearables.placeholder')} minHeight={LOG_MIN_HEIGHT} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'WatchBridge.ts',
            code: `// native module wraps WatchConnectivity (iOS) / MessageClient (Android)
// behind one JS API — screens don't care which platform they're on
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
}`,
          },
          {
            name: 'useWatchActions.ts',
            code: `// Watch → RN — one handler regardless of which platform triggered it
export function useWatchActions(handleOrderAction: (orderId: string, action: string) => void) {
  useEffect(() => {
    const sub = watchBridge.addListener('watchAction', (payload: { action: string; orderId: string }) => {
      handleOrderAction(payload.orderId, payload.action); // same reducer as the phone UI
    });
    return () => sub.remove();
  }, [handleOrderAction]);
}

// complication data (the glanceable watch-face text) is pushed separately —
// it has its own budget/refresh-rate limits, can't just piggyback the message API
CLKComplicationServer.sharedInstance().reloadTimeline(complicationDescriptor);`,
          },
        ]}
      />
    </DemoPanel>
  );
}

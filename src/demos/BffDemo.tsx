import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import BridgeLog from '../sharedComponents/BridgeLog';
import CodeTabs from '../sharedComponents/CodeTabs';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function BffDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(500);

  const STEPS: LogLine[] = [
    { text: t('demoUI.bff.step1'), kind: 'cur' },
    { text: t('demoUI.bff.step2'), kind: 'cur' },
    { text: t('demoUI.bff.step3'), kind: 'cur' },
    { text: t('demoUI.bff.step4'), kind: 'cur' },
    { text: t('demoUI.bff.step5'), kind: 'ok' },
  ];

  return (
    <DemoPanel
      desc={t('demoText.bff.desc')}
      note={t('demoText.bff.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={() => run(STEPS)}>{t('demoUI.bff.runButton')}</button>
        <BridgeLog lines={lines} placeholder={t('demoUI.bff.placeholder')} minHeight={STEPS.length * 23} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'homeScreen.ts (without a BFF)',
            code: `// Every service the screen touches means another round trip, another
// loading state, another way for one slow call to block the whole screen
const [accounts, cards, offers, profile, notifications] = await Promise.all([
  api.get('/accounts-service/accounts'),
  api.get('/cards-service/cards'),
  api.get('/offers-service/offers?segment=' + profile.segment), // needs profile first!
  api.get('/profile-service/me'),
  api.get('/notification-service/unread'),
]);
// 5 calls, 3 different services' error shapes, and a hidden ordering
// dependency (offers needs profile) the client has to know about`,
          },
          {
            name: 'homeScreen.ts (with a Mobile BFF)',
            code: `// The BFF owns the fan-out to accounts/cards/offers/core-banking
// server-side, and returns exactly what this screen renders
const { data, headers } = await api.get('/mobile/home');
assertSupportedVersion(headers['x-min-supported-version']); // see below

renderHome(data);
// data = { accounts, cards, offers, profile, unreadCount } — one shape,
// one error to handle, ordering dependencies resolved on the server`,
          },
          {
            name: 'forceUpdateGate.ts',
            code: `import { compare } from 'compare-versions';
import { APP_VERSION } from './env';

// Every BFF response carries the minimum version it still supports —
// stale clients get gated before they see any screen, not after a crash
export function assertSupportedVersion(minSupported?: string) {
  if (minSupported && compare(APP_VERSION, minSupported, '<')) {
    throw new ForceUpdateError(minSupported);
  }
}

// caught once at the app root, not per-screen:
// <ErrorBoundary onError={(e) => e instanceof ForceUpdateError && showUpdateScreen(e.minSupported)}>`,
          },
        ]}
      />
    </DemoPanel>
  );
}

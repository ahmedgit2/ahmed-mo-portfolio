import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function FirebaseDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(450);

  const ANALYTICS_STEPS: LogLine[] = [
    { text: t('demoUI.firebase.analyticsStep1'), kind: 'cur' },
    { text: t('demoUI.firebase.analyticsStep2'), kind: 'ok' },
  ];
  const CRASHLYTICS_STEPS: LogLine[] = [
    { text: t('demoUI.firebase.crashlyticsStep1'), kind: 'cur' },
    { text: t('demoUI.firebase.crashlyticsStep2'), kind: 'cur' },
    { text: t('demoUI.firebase.crashlyticsStep3'), kind: 'ok' },
  ];
  const FCM_STEPS: LogLine[] = [
    { text: t('demoUI.firebase.fcmStep1'), kind: 'cur' },
    { text: t('demoUI.firebase.fcmStep2'), kind: 'cur' },
    { text: t('demoUI.firebase.fcmStep3'), kind: 'ok' },
  ];

  return (
    <DemoPanel
      desc={t('demoText.firebase.desc')}
      note={t('demoText.firebase.note')}
    >
      <div className="demo-box">
        <div className="cta-row" style={{ marginTop: 0, marginBottom: 14 }}>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => run(ANALYTICS_STEPS)}>{t('demoUI.firebase.analyticsButton')}</button>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => run(CRASHLYTICS_STEPS)}>{t('demoUI.firebase.crashlyticsButton')}</button>
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => run(FCM_STEPS)}>{t('demoUI.firebase.fcmButton')}</button>
        </div>
        <BridgeLog lines={lines} placeholder={t('demoUI.firebase.placeholder')} minHeight={CRASHLYTICS_STEPS.length * 23} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'firebase.ts',
            code: `import { getApp } from '@react-native-firebase/app';

// google-services.json / GoogleService-Info.plist are the real config source —
// this just confirms the default app initialized before anything else touches Firebase
export function assertFirebaseReady() {
  try {
    getApp(); // throws if no default app is configured for this bundle id
  } catch {
    throw new Error('Firebase default app not initialized — check native config files');
  }
}

// called once, early in the native entry point, before any analytics/
// crashlytics/messaging call — those modules assume a default app exists`,
          },
          {
            name: 'analytics.ts',
            code: `import analytics from '@react-native-firebase/analytics';

type TicketEvent = { ticket_id: string; project_id: string };

// typed wrapper — call sites pass a known event name + shape instead of a
// raw string, so a typo doesn't silently create a new, uncounted event
export async function logTicketApproved(params: TicketEvent) {
  await analytics().logEvent('ticket_approved', params);
}

export async function trackScreen(name: string) {
  await analytics().logScreenView({ screen_name: name, screen_class: name });
}

// screen tracking is manual, not auto-instrumented — navigator route names
// don't map 1:1 onto the product-meaningful names PMs actually query for`,
          },
          {
            name: 'crashlytics.ts',
            code: `import crashlytics from '@react-native-firebase/crashlytics';

export function setCrashContext(userId: string, screen: string) {
  crashlytics().setUserId(userId);
  crashlytics().setAttributes({ screen });
}

export function logBreadcrumb(message: string) {
  crashlytics().log(message); // shows up in the crash report's log trail, most recent first
}

export async function reportHandledError(error: unknown, context: string) {
  logBreadcrumb(context);
  // recordError doesn't crash the app — this is for caught errors we still
  // want visibility on (a failed sync, a rejected approval), not a native crash
  crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
}`,
          },
          {
            name: 'fcm.ts',
            code: `import messaging from '@react-native-firebase/messaging';

export async function registerForPushNotifications(userId: string) {
  const authStatus = await messaging().requestPermission();
  const granted =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!granted) return null;

  const token = await messaging().getToken();
  await api.post('/devices/register', { userId, token, platform: Platform.OS });

  // tokens rotate — app restore on a new device, OS-level refresh — re-register
  // whenever it changes so the backend never sends to a stale token
  return messaging().onTokenRefresh((next) => {
    api.post('/devices/register', { userId, token: next, platform: Platform.OS });
  });
}

// routing on tap (foreground/background/cold-start) lives in useNotificationRouting
// (see the Push Notifications demo) — this module only gets a valid token onto the backend`,
          },
        ]}
      />
    </DemoPanel>
  );
}

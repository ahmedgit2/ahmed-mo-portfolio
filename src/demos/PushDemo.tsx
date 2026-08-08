import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

export default function PushDemo() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  function trigger() {
    setShow(false);
    // force reflow so re-triggering restarts the CSS transition, mirrors the old void offsetWidth trick
    requestAnimationFrame(() => setShow(true));
  }

  return (
    <DemoPanel
      desc={t('demoText.push.desc')}
      note={t('demoText.push.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={trigger}>{t('demoUI.push.triggerButton')}</button>
        <div className={'notif-toast' + (show ? ' show' : '')}>
          <div className="notif-dot" />
          <div>
            <div className="notif-title">{t('demoUI.push.notifTitle')}</div>
            <div className="notif-body">{t('demoUI.push.notifBody')}</div>
          </div>
        </div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'useNotificationRouting.ts',
            code: `import messaging from '@react-native-firebase/messaging';

// three lifecycle states, three different entry points into the same handler
export function useNotificationRouting(navigation: NavigationProp) {
  const route = useCallback((data: Record<string, string>) => {
    if (data?.orderId) navigation.navigate('OrderDetails', { orderId: Number(data.orderId) });
    if (data?.threadId) navigation.navigate('Chat', { threadId: data.threadId });
  }, [navigation]);

  useEffect(() => {
    // 1. foreground — app open, notification arrives while user is looking at it
    const unsubForeground = messaging().onMessage(async (msg) => {
      await notifee.displayNotification(mapToLocalNotification(msg));
    });

    // 2. background/quit tap — app was backgrounded or killed, user taps the tray notification
    const unsubOpened = messaging().onNotificationOpenedApp((msg) => route(msg.data));

    // 3. cold start — killed state, FCM's own listeners aren't attached yet at this point
    messaging().getInitialNotification().then((msg) => {
      if (msg) route(msg.data); // must run after NavigationContainer is ready
    });

    return () => { unsubForeground(); unsubOpened(); };
  }, [route]);
}

// missed this the first time in prod: getInitialNotification() resolves before
// the navigator's initial route mounts, so the navigate() call was a no-op —
// fixed by gating it on navigationRef.isReady().`,
          },
          {
            name: 'package.json',
            code: `{
  "dependencies": {
    "@react-native-firebase/app": "^21.0.0",
    "@react-native-firebase/messaging": "^21.0.0",
    "@notifee/react-native": "^7.8.2"
  }
}
// Notifee handles the actual local notification rendering — FCM's own
// foreground behavior is inconsistent across Android OEMs`,
          },
        ]}
      />
    </DemoPanel>
  );
}

import { useState } from 'react';
import DemoPanel from './DemoPanel';

export default function PushDemo() {
  const [show, setShow] = useState(false);

  function trigger() {
    setShow(false);
    // force reflow so re-triggering restarts the CSS transition, mirrors the old void offsetWidth trick
    requestAnimationFrame(() => setShow(true));
  }

  return (
    <DemoPanel
      desc="Push notifications via FCM, wired to deep links so tapping one routes straight to the relevant screen."
      note="// getInitialNotification() covers the cold-start case FCM's foreground handler misses."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={trigger}>Simulate incoming push</button>
        <div className={'notif-toast' + (show ? ' show' : '')}>
          <div className="notif-dot" />
          <div>
            <div className="notif-title">New order assigned</div>
            <div className="notif-body">Order #8842 is ready for pickup — tap to view.</div>
          </div>
        </div>
      </div>
      <pre className="code-block">{`import messaging from '@react-native-firebase/messaging';

// three lifecycle states, three different entry points into the same handler
function useNotificationRouting(navigation: NavigationProp) {
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
// fixed by gating it on navigationRef.isReady().`}</pre>
    </DemoPanel>
  );
}

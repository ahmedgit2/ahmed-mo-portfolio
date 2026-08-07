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

messaging().onNotificationOpenedApp(remoteMessage => {
  const { orderId } = remoteMessage.data;
  navigation.navigate('OrderDetails', { orderId });
});

// cold start from a killed state
messaging().getInitialNotification().then(msg => {
  if (msg) navigation.navigate('OrderDetails',
    { orderId: msg.data.orderId });
});`}</pre>
    </DemoPanel>
  );
}

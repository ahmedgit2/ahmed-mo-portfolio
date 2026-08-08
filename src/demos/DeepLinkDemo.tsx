import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import InteractiveList from '../sharedComponents/InteractiveList';

export default function DeepLinkDemo() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  const LINKS = [
    { label: 'geet://order/8842', route: t('demoUI.deeplink.linkOrder') },
    { label: 'geet://driver/119', route: t('demoUI.deeplink.linkDriver') },
    { label: 'geet://unknown/xyz', route: t('demoUI.deeplink.linkUnknown') },
  ];

  return (
    <DemoPanel
      desc={t('demoText.deeplink.desc')}
      note={t('demoText.deeplink.note')}
    >
      <div className="demo-box">
        <InteractiveList
          items={LINKS}
          selectedIndex={selected}
          onSelect={setSelected}
          renderLabel={(l) => l.label}
        />
        <div className="demo-note" style={{ marginTop: 14 }}>
          {selected === null ? t('demoUI.deeplink.pickLink') : LINKS[selected].route}
        </div>
      </div>
      <CodeTabs files={[{ name: 'linking.ts', code: `const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['geet://', 'https://geet.app'], // custom scheme + Universal Link host
  config: {
    screens: {
      OrderDetails: { path: 'order/:orderId', parse: { orderId: Number } },
      DriverProfile: { path: 'driver/:driverId', parse: { driverId: Number } },
      Chat: 'chat/:threadId',
      NotFound: '*', // catch-all, kept out of getStateFromPath below
    },
  },
  // an unmatched path shouldn't crash the navigator or leave a blank screen
  getStateFromPath: (path, options) => {
    try {
      const state = getStateFromPath(path, options);
      return state ?? buildInitialState('Home');
    } catch (err) {
      logger.warn('deep link failed to resolve', { path, err });
      return buildInitialState('Home');
    }
  },
  // cold start: app opened directly from a link, not a running instance
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;
    const message = await messaging().getInitialNotification();
    return message?.data?.link ?? null; // push notifications also carry deep links
  },
};` }]} />
    </DemoPanel>
  );
}

import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function ULinkDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(450);

  const STEPS: LogLine[] = [
    { text: t('demoUI.ulink.step1'), kind: 'cur' },
    { text: t('demoUI.ulink.step2'), kind: 'cur' },
    { text: t('demoUI.ulink.step3'), kind: 'cur' },
    { text: t('demoUI.ulink.step4'), kind: 'ok' },
  ];

  return (
    <DemoPanel
      desc={t('demoText.ulink.desc')}
      note={t('demoText.ulink.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={() => run(STEPS)}>{t('demoUI.ulink.openButton')}</button>
        <BridgeLog
          lines={lines}
          placeholder={t('demoUI.ulink.placeholder')}
          minHeight={STEPS.length * 23}
          style={{ marginTop: 14 }}
        />
      </div>
      <CodeTabs
        files={[
          {
            name: 'apple-app-site-association',
            code: `// served at https://geet.app/.well-known/apple-app-site-association
// no file extension, no redirect, must be served as application/json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.geet.app",
      "paths": ["/order/*", "/driver/*", "NOT /admin/*"]
    }]
  }
}

// Xcode: Associated Domains capability, one entry per environment
applinks:geet.app
applinks:staging.geet.app`,
          },
          {
            name: 'AndroidManifest.xml',
            code: `<!-- verified against /.well-known/assetlinks.json on geet.app -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="geet.app" />
</intent-filter>

<!-- caught in review once: staging builds pointed at the prod AASA file,
     so TestFlight links silently opened production data. Split by
     scheme and verify assetlinks.json / AASA per environment in CI
     before release. -->`,
          },
        ]}
      />
    </DemoPanel>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import type { LogLine } from '../sharedComponents/useStagedLog';

const STAGES = [10, 50, 100];

export default function OtaDemo() {
  const { t } = useTranslation();
  const [log, setLog] = useState<LogLine[]>([]);

  function stage(pct: number) {
    const lines: LogLine[] = [
      { text: t('demoUI.ota.bundlePushed', { pct }), kind: 'cur' },
    ];
    if (pct === 100) lines.push({ text: t('demoUI.ota.rolloutComplete'), kind: 'ok' });
    setLog(lines);
  }

  function rollback() {
    setLog([{ text: t('demoUI.ota.rolledBack'), kind: 'cur' }]);
  }

  return (
    <DemoPanel
      desc={t('demoText.ota.desc')}
      note={t('demoText.ota.note')}
    >
      <div className="demo-box">
        <div className="cta-row" style={{ marginTop: 0, marginBottom: 14 }}>
          {STAGES.map((pct) => (
            <button key={pct} className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => stage(pct)}>{t('demoUI.ota.stageButton', { pct })}</button>
          ))}
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={rollback}>{t('demoUI.ota.rollbackButton')}</button>
        </div>
        <BridgeLog lines={log} placeholder={t('demoUI.ota.placeholder')} minHeight={46} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'useCodePushUpdate.ts',
            code: `export function useCodePushUpdate() {
  const [downloadProgress, setDownloadProgress] = useState(0);

  function checkForUpdate() {
    codePush.sync(
      {
        deploymentKey: Config.CODEPUSH_KEY, // per-env: DEV / STAGING / PROD-ANDROID
        installMode: codePush.InstallMode.ON_NEXT_RESUME,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE, // forced security fixes
        rollbackRetryOptions: { maxRetryAttempts: 3, minBackoffMs: 60000 },
        updateDialog: false, // silent — we control messaging via in-app banner
      },
      (status) => analytics.track('codepush_status', { status }),
      ({ receivedBytes, totalBytes }) => setDownloadProgress(receivedBytes / totalBytes),
    );
  }

  // codePush.notifyAppReady() must fire post-mount, or the SDK assumes
  // the update crashed on boot and auto-rolls-back the whole cohort
  useEffect(() => {
    codePush.notifyAppReady();
  }, []);

  return { checkForUpdate, downloadProgress };
}`,
          },
          {
            name: 'rollout-notes.md',
            code: `## Staged rollout — App Center CodePush server

1. push bundle to 10% of devices
2. watch Crashlytics crash-free-users rate for ~2h
3. if stable → 50%, repeat the watch window
4. if stable → 100%

A bad bundle at any stage gets rolled back with one CLI command —
CodePush reverts affected devices to the last known-good bundle on
their next resume, no store review, no forced app update.`,
          },
        ]}
      />
    </DemoPanel>
  );
}

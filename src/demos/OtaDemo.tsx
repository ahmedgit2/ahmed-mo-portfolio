import { useState } from 'react';
import DemoPanel from './shared/DemoPanel';
import CodeTabs from './shared/CodeTabs';

const STAGES = [10, 50, 100];

export default function OtaDemo() {
  const [log, setLog] = useState<{ text: string; kind: 'ok' | 'cur' }[]>([]);

  function stage(pct: number) {
    const lines: { text: string; kind: 'ok' | 'cur' }[] = [
      { text: `⇪ Bundle v2.3.1 pushed to ${pct}% of devices — monitoring crash-free rate...`, kind: 'cur' },
    ];
    if (pct === 100) lines.push({ text: '✓ Rollout complete, no crash spike detected', kind: 'ok' });
    setLog(lines);
  }

  function rollback() {
    setLog([{ text: '↩ Rolled back — devices reverted to last known-good bundle', kind: 'cur' }]);
  }

  return (
    <DemoPanel
      desc="CodePush OTA delivery at Index Group — ship JS/asset updates without an app-store review cycle, staged and reversible."
      note="// Bad bundle at any stage → rollback reverts devices to the last known-good version."
    >
      <div className="demo-box">
        <div className="cta-row" style={{ marginTop: 0, marginBottom: 14 }}>
          {STAGES.map((pct) => (
            <button key={pct} className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={() => stage(pct)}>Stage {pct}%</button>
          ))}
          <button className="btn btn-ghost" style={{ padding: '9px 16px' }} onClick={rollback}>Rollback</button>
        </div>
        <div className="bridge-log" style={{ minHeight: 46 }}>
          {log.length === 0 && 'Pick a rollout stage →'}
          {log.map((l, i) => <div key={i} className={l.kind}>{l.text}</div>)}
        </div>
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

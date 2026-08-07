import { useState } from 'react';
import DemoPanel from './DemoPanel';

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
        <div className="bridge-log">
          {log.length === 0 && 'Pick a rollout stage →'}
          {log.map((l, i) => <div key={i} className={l.kind}>{l.text}</div>)}
        </div>
      </div>
      <pre className="code-block">{`codePush.sync({
  deploymentKey: 'PROD-ANDROID',
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  rollbackRetryOptions: { maxRetryAttempts: 3 }
});

// staged rollout, set server-side
// 10% → monitor crash-free rate → 50% → 100%`}</pre>
    </DemoPanel>
  );
}

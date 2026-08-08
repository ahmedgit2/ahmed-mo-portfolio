import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function NewArchDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(450);

  const STEPS: LogLine[] = [
    { text: t('demoUI.newarch.step1'), kind: 'cur' },
    { text: t('demoUI.newarch.step2'), kind: 'cur' },
    { text: t('demoUI.newarch.step3'), kind: 'cur' },
    { text: t('demoUI.newarch.step4'), kind: 'cur' },
    { text: t('demoUI.newarch.step5'), kind: 'ok' },
  ];

  return (
    <DemoPanel
      desc={t('demoText.newarch.desc')}
      note={t('demoText.newarch.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={() => run(STEPS)}>{t('demoUI.newarch.runButton')}</button>
        <BridgeLog lines={lines} placeholder={t('demoUI.newarch.placeholder')} minHeight={STEPS.length * 23} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'ScannerBridge.legacy.ts',
            code: `// old architecture — every call crosses the bridge as a JSON string
NativeModules.BarcodeScanner.getConnectionState(
  (state) => setScannerState(state),
  (error) => logger.error(error),
); // args + return value both serialized, queued, deserialized — ~30-50ms`,
          },
          {
            name: 'NativeBarcodeScanner.ts',
            code: `// TurboModule spec — codegen reads this interface and generates the
// native glue code for iOS (Objective-C++) and Android (Java/JNI)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getConnectionState(): string; // sync, returns directly
  subscribeToScanEvents(callback: (event: ScanEvent) => void): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BarcodeScanner');

// usage — JSI gives JS a direct pointer to the native HostObject,
// no bridge queue, no JSON.stringify/parse, callable synchronously
import BarcodeScanner from './NativeBarcodeScanner';
const state = BarcodeScanner.getConnectionState(); // <1ms`,
          },
          {
            name: 'MIGRATION_NOTES.md',
            code: `## RN 0.7x → 0.85, Hermes + New Architecture

- 40+ third-party native modules audited before the upgrade window opened
- most had Fabric-compatible releases; a handful were forked and patched
  in-house to unblock us, PRs opened upstream afterward
- Fabric renderer changed a few third-party UI libs' measurement timing —
  caught via the existing test suite + a two-week internal dogfood period
- rollout was staged behind a remote config flag, not a big-bang release`,
          },
        ]}
      />
    </DemoPanel>
  );
}

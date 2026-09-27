import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import BridgeLog from '../sharedComponents/BridgeLog';
import CodeTabs from '../sharedComponents/CodeTabs';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function SecurityDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(420);
  const [secure, setSecure] = useState(false);

  const STEPS: LogLine[] = [
    { text: t('demoUI.security.step1'), kind: 'cur' },
    { text: t('demoUI.security.step2'), kind: 'cur' },
    { text: t('demoUI.security.step3'), kind: 'cur' },
    { text: t('demoUI.security.step4'), kind: 'cur' },
    { text: t('demoUI.security.step5'), kind: 'ok' },
  ];

  return (
    <DemoPanel
      desc={t('demoText.security.desc')}
      note={t('demoText.security.note')}
    >
      <div className="demo-box">
        <button
          className={'btn' + (secure ? ' btn-primary' : ' btn-ghost')}
          style={{ padding: '9px 16px', marginBottom: 10 }}
          onClick={() => setSecure((s) => !s)}
        >
          {t('demoUI.security.secureScreenLabel')} — {secure ? t('demoUI.security.secureScreenOn') : t('demoUI.security.secureScreenOff')}
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '9px 16px', marginBottom: 14, marginInlineStart: 8 }}
          onClick={() => run(STEPS)}
        >
          {t('demoUI.security.encryptButton')}
        </button>
        <BridgeLog lines={lines} placeholder={t('demoUI.security.placeholder')} minHeight={STEPS.length * 23} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'crypto.ts',
            code: `// npm i react-native-quick-crypto — JSI, Node-compatible crypto API
import { Buffer } from '@craftzdog/react-native-buffer';
import QuickCrypto from 'react-native-quick-crypto';
import { getSessionKey } from './keyStore'; // 32-byte key from a handshake, memory only

export async function encryptBody(body: unknown) {
  const key = await getSessionKey();
  const iv = QuickCrypto.randomBytes(12); // fresh IV every request — never reused

  const cipher = QuickCrypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(JSON.stringify(body), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // authentication tag — detects tampering on decrypt

  return Buffer.concat([iv, ct, tag]).toString('base64'); // iv ‖ ciphertext ‖ tag
}

export async function decryptBody(payload: string) {
  const key = await getSessionKey();
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(raw.length - 16);
  const ct = raw.subarray(12, raw.length - 16);

  const decipher = QuickCrypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag); // throws if the payload was altered in transit
  return JSON.parse(Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8'));
}`,
          },
          {
            name: 'crypto.contract.test.ts',
            code: `// Reproducing someone else's AES contract means matching it byte-for-byte —
// so the backend team's test vectors are the source of truth, not my own math
import vectors from './fixtures/aes-gcm-vectors.json';

test.each(vectors)('matches backend vector %#', ({ keyHex, ivHex, plain, expected }) => {
  const out = encryptWithFixedIv(
    Buffer.from(keyHex, 'hex'),
    Buffer.from(ivHex, 'hex'),
    plain,
  );
  expect(out).toBe(expected); // exact match required before this touches any UI
});`,
          },
          {
            name: 'NativeSecurityModule.kt',
            code: `// FLAG_SECURE has no JS equivalent — it must be a native module.
// iOS has no direct counterpart; the common approach there is blurring the
// app on UIApplicationWillResignActive so the app-switcher snapshot is blank.
class NativeSecurityModule(ctx: ReactApplicationContext) : NativeSecuritySpec(ctx) {
  override fun setSecureScreen(enabled: Boolean) {
    val activity = reactApplicationContext.currentActivity ?: return
    activity.runOnUiThread {
      if (enabled) activity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
      else activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
  }

  override fun isDeviceCompromised(promise: Promise) {
    val suPaths = listOf("/system/xbin/su", "/system/bin/su", "/sbin/su")
    promise.resolve(suPaths.any { java.io.File(it).exists() })
  }
}`,
          },
          {
            name: 'sslPinning.ts',
            code: `// SSL/certificate pinning: trust only a known public key hash for this
// host, not just "any cert a public CA signed" — blocks MITM even if a
// CA is compromised. Always ship a backup pin or a bad cert rotation
// bricks the app until an update ships.
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';

await initializeSslPinning({
  'api.bank.com': {
    includeSubdomains: true,
    publicKeyHashes: [
      'znZeAzewrCoVCz5t4a0Yz3MpKgCyRUhV0lRQ8YyGpuY=', // current leaf key
      'e0Z3G3EMepz3q5PzZjZGQmSKQzZDVJK2y+65Q3Ymz3c=', // backup — for the next rotation
    ],
  },
});

// pairs with the axios client from the REST API demo — a pin mismatch
// fails the TLS handshake before the request interceptor ever runs`,
          },
        ]}
      />
    </DemoPanel>
  );
}

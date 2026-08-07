import { useState } from 'react';
import DemoPanel from './DemoPanel';

export default function StorageDemo() {
  const [store, setStore] = useState<Record<string, string>>({});
  const [key, setKey] = useState('');
  const [val, setVal] = useState('');

  function handleSave() {
    const k = key.trim();
    if (!k) return;
    setStore((s) => ({ ...s, [k]: val.trim() || '(empty)' }));
    setKey('');
    setVal('');
  }

  const entries = Object.entries(store);

  return (
    <DemoPanel
      desc="Migrated PlanRadar's persistence from AsyncStorage to MMKV — synchronous, encrypted, faster reads."
      note="// MMKV writes are synchronous — no await, no flicker on read."
    >
      <div className="demo-box">
        <div className="kv-row">
          <input type="text" placeholder="key" value={key} onChange={(e) => setKey(e.target.value)} />
          <input type="text" placeholder="value" value={val} onChange={(e) => setVal(e.target.value)} />
          <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={handleSave}>Set</button>
        </div>
        <div className="kv-list">
          {entries.length === 0
            ? <div className="kv-item"><span>—</span><span>no keys yet</span></div>
            : entries.map(([k, v]) => (
              <div className="kv-item" key={k}><span>{k}</span><span>{v}</span></div>
            ))}
        </div>
      </div>
      <pre className="code-block">{`// before — AsyncStorage, async everywhere it's touched
async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token'); // ~2-5ms, disk I/O off JS thread
}
// every screen mount that reads a cached value needs a loading state
// just to cover the await — noticeable flicker on cold start.

// after — MMKV, backed by mmap, synchronous
import { MMKV } from 'react-native-mmkv';

const secureStorage = new MMKV({
  id: 'planradar-secure',
  encryptionKey: getDeviceKeystoreKey(), // per-device, from Keychain/Keystore
});

export function getAuthToken(): string | null {
  return secureStorage.getString('auth_token') ?? null; // <1ms, no await
}

export function setAuthToken(token: string): void {
  secureStorage.set('auth_token', token);
}

// migration ran once on app boot behind a feature flag,
// reading both stores and preferring MMKV once populated
async function migrateFromAsyncStorage() {
  const legacy = await AsyncStorage.getItem('auth_token');
  if (legacy && !secureStorage.contains('auth_token')) {
    secureStorage.set('auth_token', legacy);
  }
}`}</pre>
    </DemoPanel>
  );
}

import { useState } from 'react';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

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
      <CodeTabs
        files={[
          {
            name: 'secureStorage.ts',
            code: `// before — AsyncStorage, async everywhere it's touched
async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token'); // ~2-5ms, disk I/O off JS thread
}
// every screen mount that reads a cached value needs a loading state
// just to cover the await — noticeable flicker on cold start.

// after — MMKV, backed by mmap, synchronous
import { MMKV } from 'react-native-mmkv';

const secureStorage = new MMKV({
  id: 'app-secure',
  encryptionKey: getDeviceKeystoreKey(), // per-device, from Keychain/Keystore
});

export function getAuthToken(): string | null {
  return secureStorage.getString('auth_token') ?? null; // <1ms, no await
}

export function setAuthToken(token: string): void {
  secureStorage.set('auth_token', token);
}`,
          },
          {
            name: 'migrateLegacyStorage.ts',
            code: `// ran once on app boot behind a feature flag — reads both stores,
// prefers MMKV once populated, deletes the AsyncStorage copy after
export async function migrateFromAsyncStorage() {
  if (secureStorage.getBoolean('migrated_v2')) return;

  const keys = ['auth_token', 'user_prefs', 'last_project_id'];
  for (const key of keys) {
    const legacy = await AsyncStorage.getItem(key);
    if (legacy !== null && !secureStorage.contains(key)) {
      secureStorage.set(key, legacy);
    }
  }

  secureStorage.set('migrated_v2', true);
  await AsyncStorage.multiRemove(keys); // don't leave stale copies around
}`,
          },
          {
            name: 'package.json',
            code: `{
  "dependencies": {
    "react-native-mmkv": "^2.12.2"
  }
}
// requires a dev-client rebuild (or bare workflow) — MMKV links native
// code, it's not compatible with Expo Go`,
          },
        ]}
      />
    </DemoPanel>
  );
}

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
      <pre className="code-block">{`// AsyncStorage — async
await AsyncStorage.setItem('token', v);

// MMKV — sync, encrypted
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: deviceKey
});
storage.set('token', v);
const t = storage.getString('token');`}</pre>
    </DemoPanel>
  );
}

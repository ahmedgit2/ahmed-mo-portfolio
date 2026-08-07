import { useRef, useState } from 'react';
import DemoPanel from './DemoPanel';

const TOTAL = 128;
const TARGET_COV = 94;

export default function TestingDemo() {
  const [count, setCount] = useState(0);
  const [cov, setCov] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  function run() {
    if (timer.current) clearInterval(timer.current);
    setDone(false);
    let c = 0;
    let v = 0;
    timer.current = window.setInterval(() => {
      c += 8;
      v += 6;
      setCount(Math.min(c, TOTAL));
      setCov(Math.min(v, TARGET_COV));
      if (c >= TOTAL) {
        if (timer.current) clearInterval(timer.current);
        setCount(TOTAL);
        setCov(TARGET_COV);
        setDone(true);
      }
    }, 90);
  }

  return (
    <DemoPanel
      desc="1,500+ commits across 200+ tickets at PlanRadar, guarded by a 3,500+ test suite in GitLab CI/CD. Run a sample suite."
      note="// CI blocks merge on red tests — coverage gate keeps refactors safe across 200+ tickets."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={run}>Run suite</button>
        <div className="render-counter" style={{ marginTop: 0 }}>
          <span>Tests: <b>{count}</b>/{TOTAL}</span>
          <span>Coverage: <b>{cov}</b>%</span>
          {done && <span><b style={{ color: '#7FBF8F' }}>✓ all green</b></span>}
        </div>
      </div>
      <pre className="code-block">{`describe('useDocumentSelection', () => {
  it('uses O(1) Set lookup, not array scan', () => {
    const { result } = renderHook(() => useDocumentSelection());
    act(() => result.current.toggle('doc-1'));
    expect(result.current.selected.has('doc-1')).toBe(true);
    expect(result.current.selected.size).toBe(1);
  });

  it('does not re-toggle a row already flushed to the sync queue', () => {
    const { result } = renderHook(() => useDocumentSelection());
    act(() => result.current.toggle('doc-1'));
    act(() => result.current.flush());
    act(() => result.current.toggle('doc-1')); // re-select after flush is fine
    expect(mockOfflineQueue.push).toHaveBeenCalledTimes(1);
  });
});

// component test — offline queue behavior, not just the reducer
it('queues approval when NetInfo reports offline', async () => {
  mockNetInfo.mockReturnValue({ isConnected: false });
  const { getByText } = render(<DocumentApprovalScreen documentId="doc-1" />);

  fireEvent.press(getByText('Approve'));

  await waitFor(() =>
    expect(getByText(/queued — will sync when online/i)).toBeTruthy()
  );
});

// CI gate: yarn test --coverage --ci, merge blocked below 90% on changed files
// jest.config.js
coverageThreshold: {
  './src/containers/**': { branches: 85, functions: 90, lines: 90 },
}`}</pre>
    </DemoPanel>
  );
}

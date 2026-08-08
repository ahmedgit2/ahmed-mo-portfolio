import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

const TOTAL = 128;
const TARGET_COV = 94;

export default function TestingDemo() {
  const { t } = useTranslation();
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
      desc={t('demoText.testing.desc')}
      note={t('demoText.testing.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={run}>{t('demoUI.testing.runButton')}</button>
        <div className="render-counter" style={{ marginTop: 0 }}>
          <span>{t('demoUI.testing.testsLabel')} <b>{count}</b>/{TOTAL}</span>
          <span>{t('demoUI.testing.coverageLabel')} <b>{cov}</b>%</span>
          {done && <span><b style={{ color: '#7FBF8F' }}>{t('demoUI.testing.allGreen')}</b></span>}
        </div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'useRowSelection.test.ts',
            code: `describe('useRowSelection', () => {
  it('uses O(1) Set lookup, not array scan', () => {
    const { result } = renderHook(() => useRowSelection());
    act(() => result.current.toggle('row-1'));
    expect(result.current.selected.has('row-1')).toBe(true);
    expect(result.current.selected.size).toBe(1);
  });

  it('does not re-toggle a row already flushed to the sync queue', () => {
    const { result } = renderHook(() => useRowSelection());
    act(() => result.current.toggle('row-1'));
    act(() => result.current.flush());
    act(() => result.current.toggle('row-1')); // re-select after flush is fine
    expect(mockOfflineQueue.push).toHaveBeenCalledTimes(1);
  });
});`,
          },
          {
            name: 'ItemApprovalScreen.test.tsx',
            code: `// component test — offline queue behavior, not just the reducer
it('queues approval when NetInfo reports offline', async () => {
  mockNetInfo.mockReturnValue({ isConnected: false });
  const { getByText } = render(<ItemApprovalScreen itemId="row-1" />);

  fireEvent.press(getByText('Approve'));

  await waitFor(() =>
    expect(getByText(/queued — will sync when online/i)).toBeTruthy()
  );
});

it('flushes the queue in order once NetInfo reports back online', async () => {
  mockNetInfo.mockReturnValue({ isConnected: true });
  const { getByText } = render(<ItemApprovalScreen itemId="row-1" />);

  await waitFor(() => expect(mockSocket.send).toHaveBeenCalledWith(
    expect.stringContaining('"type":"APPROVE"'),
  ));
});`,
          },
          {
            name: 'jest.config.js',
            code: `module.exports = {
  preset: 'react-native',
  setupFilesAfterEach: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*)/)',
  ],
  coverageThreshold: {
    global: { branches: 75, functions: 80, lines: 80 },
    './src/containers/**': { branches: 85, functions: 90, lines: 90 },
  },
};

// CI runs: yarn test --coverage --ci
// merge is blocked below threshold on changed files — the tighter
// container-level bar is where most business logic lives`,
          },
        ]}
      />
    </DemoPanel>
  );
}

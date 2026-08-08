import { useRef, useState } from 'react';

export type LogLine = { text: string; kind: 'ok' | 'cur' };

/**
 * Reveals a fixed list of log lines one at a time on a stagger, replaying
 * from empty on each call. Shared by every demo that simulates a step-by-step
 * trace (Universal Links, New Architecture, Wearables) — previously each
 * reimplemented the same setTimeout/clearTimeout bookkeeping by hand.
 */
export function useStagedLog(stepDelayMs = 450) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const timers = useRef<number[]>([]);

  function run(steps: LogLine[]) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLines([]);
    steps.forEach((step, i) => {
      const id = window.setTimeout(() => setLines((prev) => [...prev, step]), i * stepDelayMs);
      timers.current.push(id);
    });
  }

  return { lines, run };
}

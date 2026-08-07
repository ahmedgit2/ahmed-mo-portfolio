import { useRef, useState } from 'react';

type StepState = 'idle' | 'active' | 'done';

/** Shared step-runner used by the CI/CD and native-release demos. */
export function usePipeline(steps: string[], stepDelayMs: number) {
  const [states, setStates] = useState<StepState[]>(steps.map(() => 'idle'));
  const timers = useRef<number[]>([]);

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStates(steps.map(() => 'idle'));
    steps.forEach((_, i) => {
      const activateId = window.setTimeout(() => {
        setStates((prev) => prev.map((s, idx) => (idx === i ? 'active' : s === 'active' ? 'idle' : s)));
      }, i * stepDelayMs);
      const doneId = window.setTimeout(() => {
        setStates((prev) => prev.map((s, idx) => (idx === i ? 'done' : s)));
      }, i * stepDelayMs + 500);
      timers.current.push(activateId, doneId);
    });
  }

  return { states, run };
}

export default function PipelineSteps({ steps, states }: { steps: string[]; states: StepState[] }) {
  return (
    <div className="pipeline-steps">
      {steps.map((s, i) => (
        <div className={'pstep' + (states[i] === 'active' ? ' active' : states[i] === 'done' ? ' done' : '')} key={s}>
          <span className="dot" />{s}
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import DemoPanel from './DemoPanel';

const ITEMS = Array.from({ length: 14 }, (_, i) => `Task item #${i + 1}`);

export default function ListPerfDemo() {
  const [selected, setSelected] = useState(0);
  const [oldCount, setOldCount] = useState(0);

  function handleSelect(i: number) {
    setOldCount((c) => c + ITEMS.length); // simulate full-list re-render, O(n)
    setSelected(i);
  }

  return (
    <DemoPanel
      desc="At PlanRadar, selecting a row in a large list re-rendered every row via array-identity comparison — O(n²). I swapped it for a Set-membership lookup, so only the touched row re-renders. Click rows below."
      note="// Old: full list re-renders on every selection. New: only the touched row updates."
    >
      <div className="demo-box">
        <div className="fake-list">
          {ITEMS.map((label, i) => (
            <div
              key={label}
              className={'fake-row' + (i === selected ? ' selected' : '')}
              onClick={() => handleSelect(i)}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="render-counter">
          <span>Old: <b>{oldCount}</b></span>
          <span>New: <b>1</b></span>
        </div>
      </div>
      <pre className="code-block">{`// before — O(n²)
const toggle = (id) => {
  setSelected(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  );
};

// after — O(1), Set membership
const toggle = (id) => {
  setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};`}</pre>
    </DemoPanel>
  );
}

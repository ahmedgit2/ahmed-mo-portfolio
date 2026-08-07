import { useState } from 'react';
import DemoPanel from './DemoPanel';

const TV_LABELS = ['Home', 'Search', 'Library', 'Live', 'Settings', 'Profile', 'Downloads', 'Guide', 'Exit'];

export default function TvDemo() {
  const [focus, setFocus] = useState(4); // center tile starts focused
  const [log, setLog] = useState<{ text: string; kind: 'ok' | 'cur' } | null>(null);

  function move(dir: 'up' | 'down' | 'left' | 'right' | 'ok') {
    if (dir === 'ok') {
      setLog({ text: `✓ onFocus → onPress fired on "${TV_LABELS[focus]}"`, kind: 'ok' });
      return;
    }
    const row = Math.floor(focus / 3);
    const col = focus % 3;
    let next = focus;
    if (dir === 'up' && row > 0) next -= 3;
    if (dir === 'down' && row < 2) next += 3;
    if (dir === 'left' && col > 0) next -= 1;
    if (dir === 'right' && col < 2) next += 1;
    setFocus(next);
    setLog({ text: `→ TVEventHandler: focus moved to "${TV_LABELS[next]}"`, kind: 'cur' });
  }

  return (
    <DemoPanel
      desc="Extending React Native to Smart TV — tvOS and Android TV via react-native-tvos — swaps touch for D-pad focus navigation. No shipped production app yet — architecture below is how I'd approach it."
      note="// Same component model, different input system — focus/spatial nav replaces touch gestures."
    >
      <div className="demo-box">
        <div className="tv-grid">
          {TV_LABELS.map((label, i) => (
            <div className={'tv-tile' + (i === focus ? ' focused' : '')} key={label}>{label}</div>
          ))}
        </div>
        <div className="dpad">
          <span className="empty" /><button className="btn btn-ghost" onClick={() => move('up')}>▲</button><span className="empty" />
          <button className="btn btn-ghost" onClick={() => move('left')}>◀</button>
          <button className="btn btn-ghost" onClick={() => move('ok')}>OK</button>
          <button className="btn btn-ghost" onClick={() => move('right')}>▶</button>
          <span className="empty" /><button className="btn btn-ghost" onClick={() => move('down')}>▼</button><span className="empty" />
        </div>
        <div className="bridge-log">
          {log ? <div className={log.kind}>{log.text}</div> : 'Use the D-pad to move focus →'}
        </div>
      </div>
      <pre className="code-block">{`// Smart TV — focus management
<Pressable
  hasTVPreferredFocus={isFirst}
  onFocus={() => setFocused(id)}
  style={({ focused }) => focused && styles.focusRing}
/>

// TVEventHandler for remote/D-pad input
const tvEventHandler = new TVEventHandler();
tvEventHandler.enable(this, (cmp, evt) => {
  if (evt.eventType === 'right') moveFocus('right');
  if (evt.eventType === 'select') pressFocused();
});`}</pre>
    </DemoPanel>
  );
}

import { useState } from 'react';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import type { LogLine } from '../sharedComponents/useStagedLog';

const TV_LABELS = ['Home', 'Search', 'Library', 'Live', 'Settings', 'Profile', 'Downloads', 'Guide', 'Exit'];

export default function TvDemo() {
  const [focus, setFocus] = useState(4); // center tile starts focused
  const [log, setLog] = useState<LogLine | null>(null);

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
        <BridgeLog lines={log ? [log] : []} placeholder="Use the D-pad to move focus →" />
      </div>
      <CodeTabs
        files={[
          {
            name: 'MenuTile.tsx',
            code: `// react-native-tvos — grid of focusable tiles, arrow keys move focus natively
export function MenuTile({ id, label, isFirst }: TileProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      hasTVPreferredFocus={isFirst} // where focus lands on mount
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.tile, focused && styles.tileFocused]}
      // tvParallaxProperties tunes the built-in tvOS focus-lift effect
      tvParallaxProperties={{ magnification: 1.05 }}
    >
      <Text style={focused && styles.textFocused}>{label}</Text>
    </Pressable>
  );
}`,
          },
          {
            name: 'useTVEventHandler.ts',
            code: `// needed when you manage focus imperatively — e.g. a custom carousel
// react-native-tvos doesn't auto-handle
export function useTVEventHandler(moveFocus: (dir: TVFocusDir) => void, pressFocused: () => void) {
  useEffect(() => {
    const handler = new TVEventHandler();
    handler.enable(undefined, (_component, event) => {
      switch (event.eventType) {
        case 'right': case 'left': case 'up': case 'down':
          moveFocus(event.eventType);
          break;
        case 'select':
          pressFocused();
          break;
      }
    });
    return () => handler.disable();
  }, [moveFocus, pressFocused]);
}

// biggest gotcha porting an existing screen: touch-only components
// (custom sliders, swipeable rows) have no focus concept at all —
// each needed a Pressable + hasTVPreferredFocus wrapper rewritten for TV.`,
          },
          {
            name: 'package.json',
            code: `{
  "dependencies": {
    "react-native": "npm:react-native-tvos@0.85.0-0"
  }
}
// react-native-tvos is a fork, aliased over the real "react-native"
// package — everything else in the app tree imports it unmodified`,
          },
        ]}
      />
    </DemoPanel>
  );
}

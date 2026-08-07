import { useRef, useState } from 'react';

export default function AnimDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);
  const [popShown, setPopShown] = useState(false);

  function handleSlide() {
    setAtEnd((v) => !v);
  }

  const distance = stageRef.current && chipRef.current
    ? stageRef.current.clientWidth - chipRef.current.offsetWidth
    : 0;

  return (
    <>
      <p className="tab-desc">Reanimated / Animated API drives modal and navigation transitions at PlanRadar. Two examples below.</p>
      <div className="demo-grid">
        <div className="demo-box">
          <div className="anim-stage" ref={stageRef}>
            <div
              className="anim-chip"
              ref={chipRef}
              style={{ transform: atEnd ? `translateX(${distance}px)` : 'translateX(0)' }}
            >
              RN
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={handleSlide}>Slide transition</button>
          <div className={'pop-card' + (popShown ? ' shown' : '')}>
            <div className="pc-title">Document approved</div>
            <div className="pc-sub">Spring pop-in, like a modal confirmation.</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '9px 16px', marginTop: 12 }} onClick={() => setPopShown((v) => !v)}>Spring pop-in</button>
        </div>
        <pre className="code-block">{`const x = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(x.value,
    { damping: 14, stiffness: 120 }) }]
}));

// modal pop-in
const scale = useSharedValue(0.6);
const popStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(scale.value,
    { damping: 10, stiffness: 140 }) }],
  opacity: withTiming(scale.value === 1 ? 1 : 0)
}));`}</pre>
      </div>
      <div className="demo-note">// Reanimated worklets run on the UI thread — no JS-thread jank under load.</div>
    </>
  );
}

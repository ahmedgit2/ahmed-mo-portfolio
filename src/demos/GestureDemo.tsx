import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

type Card = { id: number; title: string };

const INITIAL_CARDS: Card[] = [
  { id: 1, title: 'ITEM-4821' },
  { id: 2, title: 'ITEM-4822' },
  { id: 3, title: 'ITEM-4823' },
  { id: 4, title: 'ITEM-4824' },
];

const CARD_SUB_KEY: Record<number, string> = {
  1: 'demoUI.gesture.card1Sub',
  2: 'demoUI.gesture.card2Sub',
  3: 'demoUI.gesture.card3Sub',
  4: 'demoUI.gesture.card4Sub',
};

const DISMISS_THRESHOLD = 110; // px
const FLICK_VELOCITY = 0.55; // px/ms
const SWIPE_OUT_X = 420;

/**
 * A damped-spring value driven by requestAnimationFrame, mutating a DOM
 * element's transform directly — no React state per frame, no re-render
 * storm. This is the same numerical model react-native-reanimated's
 * withSpring uses under the hood (critically-damped harmonic oscillator).
 *
 * `token` is a cancellation guard: if a new drag grabs the same card before
 * this animation settles, the caller bumps the token and this loop notices
 * on its next frame and quietly stops — otherwise two RAF loops fight over
 * the same element's transform and the card visually "sticks"/glitches.
 */
function animateSpring(
  el: HTMLElement,
  from: { x: number; rotate: number },
  to: { x: number; rotate: number },
  velocity: number,
  tokens: Record<number, number>,
  cardId: number,
  myToken: number,
  onDone?: () => void,
) {
  const stiffness = 210;
  const damping = 22;
  const mass = 1;
  let x = from.x;
  let v = velocity;

  function tick() {
    if (tokens[cardId] !== myToken) return; // superseded by a newer drag/animation

    const Fspring = -stiffness * (x - to.x);
    const Fdamper = -damping * v;
    const a = (Fspring + Fdamper) / mass;
    v += a * (1 / 60);
    x += v * (1 / 60);

    const progress = to.x === from.x ? 1 : (x - from.x) / (to.x - from.x);
    const rotate = from.rotate + (to.rotate - from.rotate) * Math.min(Math.max(progress, 0), 1);
    el.style.transform = `translateX(${x}px) rotate(${rotate}deg)`;
    el.style.opacity = to.x !== 0 ? String(Math.max(1 - Math.abs(x) / SWIPE_OUT_X, 0)) : '1';

    const settled = Math.abs(x - to.x) < 0.5 && Math.abs(v) < 0.5;
    if (settled) {
      el.style.transform = `translateX(${to.x}px) rotate(${to.rotate}deg)`;
      onDone?.();
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function GestureDemo() {
  const { t } = useTranslation();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const springTokens = useRef<Record<number, number>>({});
  const drag = useRef<{ id: number; startX: number; lastX: number; lastT: number; v: number } | null>(null);

  // Window-level listeners, not per-element React props — this is the
  // battle-tested pattern for custom drag: it keeps tracking the pointer
  // even if it moves faster than the element under it, and guarantees
  // pointerup/cancel always reach us regardless of what's under the cursor
  // when the button is released.
  useEffect(() => {
    function handleMove(e: PointerEvent) {
      if (!drag.current) return;
      const el = cardRefs.current[drag.current.id];
      if (!el) return;
      const dx = e.clientX - drag.current.startX;
      const now = performance.now();
      const dt = Math.max(now - drag.current.lastT, 1);
      drag.current.v = (e.clientX - drag.current.lastX) / dt;
      drag.current.lastX = e.clientX;
      drag.current.lastT = now;

      const rotate = dx / 18;
      el.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;
      el.style.opacity = String(Math.max(1 - Math.abs(dx) / SWIPE_OUT_X, 0.3));
    }

    function handleUp() {
      if (!drag.current) return;
      const { id, lastX, startX, v } = drag.current;
      const el = cardRefs.current[id];
      const dx = lastX - startX;
      drag.current = null;
      document.body.style.cursor = '';
      if (!el) return;

      const shouldDismiss = Math.abs(dx) > DISMISS_THRESHOLD || Math.abs(v) > FLICK_VELOCITY;
      const myToken = (springTokens.current[id] = (springTokens.current[id] ?? 0) + 1);

      if (shouldDismiss) {
        const dir = dx !== 0 ? Math.sign(dx) : (v !== 0 ? Math.sign(v) : 1);
        animateSpring(
          el,
          { x: dx, rotate: dx / 18 },
          { x: dir * SWIPE_OUT_X, rotate: dir * 22 },
          v * 16,
          springTokens.current,
          id,
          myToken,
          () => setCards((prev) => [...prev.slice(1), prev[0]]),
        );
      } else {
        animateSpring(el, { x: dx, rotate: dx / 18 }, { x: 0, rotate: 0 }, v * 16, springTokens.current, id, myToken);
      }
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>, id: number) {
    if (id !== cards[0]?.id) return; // only the front card is draggable
    const el = cardRefs.current[id];
    if (el) el.style.transition = 'none';
    springTokens.current[id] = (springTokens.current[id] ?? 0) + 1; // invalidate any in-flight spring for this card
    drag.current = { id, startX: e.clientX, lastX: e.clientX, lastT: performance.now(), v: 0 };
    document.body.style.cursor = 'grabbing';
  }

  return (
    <DemoPanel
      desc={t('demoText.gesture.desc')}
      note={t('demoText.gesture.note')}
    >
      <div className="demo-box">
        <div className="gesture-stack">
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[card.id] = el; }}
              className="gesture-card"
              style={{
                zIndex: cards.length - i,
                transform: `translateX(0) rotate(0deg) scale(${1 - i * 0.04}) translateY(${i * 8}px)`,
              }}
              onPointerDown={(e) => onPointerDown(e, card.id)}
            >
              <div className="gesture-card-title">{card.title}</div>
              <div className="gesture-card-sub">{t(CARD_SUB_KEY[card.id])}</div>
              <div className="gesture-card-hint">{t('demoUI.gesture.hint')}</div>
            </div>
          ))}
        </div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'useSwipeStack.ts',
            code: `// real react-native-reanimated + react-native-gesture-handler equivalent
export function useSwipeCard(onDismiss: () => void) {
  const translateX = useSharedValue(0);
  const rotate = useDerivedValue(() => translateX.value / 18);

  const gesture = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      const shouldDismiss =
        Math.abs(e.translationX) > 110 || Math.abs(e.velocityX) > 550;

      if (shouldDismiss) {
        const dir = Math.sign(e.translationX || e.velocityX || 1);
        translateX.value = withSpring(dir * 420, {
          velocity: e.velocityX,
          stiffness: 210,
          damping: 22,
        }, () => runOnJS(onDismiss)());
      } else {
        translateX.value = withSpring(0, {
          velocity: e.velocityX,
          stiffness: 210,
          damping: 22,
        });
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: \`\${rotate.value}deg\` },
    ],
    opacity: interpolate(
      Math.abs(translateX.value), [0, 420], [1, 0], Extrapolation.CLAMP,
    ),
  }));

  return { gesture, style };
}`,
          },
          {
            name: 'notes.md',
            code: `## Why a hand-rolled spring, not withTiming

withSpring integrates a damped harmonic oscillator every frame — it responds
to the release *velocity* from the gesture, so a fast flick keeps carrying
momentum into the spring instead of the card feeling like it "snaps" to a
fixed duration. That's the difference between an animation that feels
scripted and one that feels physical.

On the web version of this demo (no Reanimated runtime available in a
browser), I re-implemented the same stiffness/damping integration by hand,
driving it via requestAnimationFrame and mutating the DOM node's transform
directly — skipping React state during the drag entirely so it stays at
60fps regardless of render cost elsewhere on the page.

A cancellation token per card guards against two spring loops fighting over
the same element if it's re-grabbed before the previous release animation
settles — real Reanimated's withSpring handles this internally; here it's
explicit since it's hand-rolled.`,
          },
        ]}
      />
    </DemoPanel>
  );
}

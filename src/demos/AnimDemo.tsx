import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';

export default function AnimDemo() {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);
  const [popShown, setPopShown] = useState(false);

  const distance = stageRef.current && chipRef.current
    ? stageRef.current.clientWidth - chipRef.current.offsetWidth
    : 0;

  return (
    <DemoPanel
      desc={t('demoText.anim.desc')}
      note={t('demoText.anim.note')}
    >
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
        <button className="btn btn-ghost" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={() => setAtEnd((v) => !v)}>{t('demoUI.anim.slideButton')}</button>
        <div className={'pop-card' + (popShown ? ' shown' : '')}>
          <div className="pc-title">{t('demoUI.anim.popTitle')}</div>
          <div className="pc-sub">{t('demoUI.anim.popSubtitle')}</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '9px 16px', marginTop: 12 }} onClick={() => setPopShown((v) => !v)}>{t('demoUI.anim.springButton')}</button>
      </div>
      <CodeTabs
        files={[
          {
            name: 'useSlideTransition.ts',
            code: `// gesture-driven dismiss transition — runs entirely on the UI thread
export function useSlideTransition() {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      const shouldDismiss = e.translationX > SCREEN_WIDTH * 0.3 || e.velocityX > 800;
      translateX.value = withSpring(shouldDismiss ? SCREEN_WIDTH : 0, {
        damping: 18,
        stiffness: 140,
        velocity: e.velocityX, // hand off gesture velocity, feels continuous
      });
      if (shouldDismiss) runOnJS(navigation.goBack)();
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { gesture, style };
}`,
          },
          {
            name: 'ApprovalModal.tsx',
            code: `// pop-in confirmation, mirrors a system alert's feel
export function ApprovalModal({ visible, title }: Props) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.6, { damping: 12, stiffness: 160 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [visible]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, popStyle]}>
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
}`,
          },
          {
            name: 'package.json',
            code: `{
  "dependencies": {
    "react-native-reanimated": "^3.15.0",
    "react-native-gesture-handler": "^2.19.0"
  }
}
// Reanimated also needs its Babel plugin last in babel.config.js —
// order matters, a misplaced plugin silently breaks worklets in release builds`,
          },
        ]}
      />
    </DemoPanel>
  );
}

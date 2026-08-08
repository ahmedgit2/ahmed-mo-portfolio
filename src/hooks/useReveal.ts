import { useEffect, useRef, useState } from 'react';

/**
 * Fades + slides a section in once it scrolls into view. Fires once
 * (unobserves after), so scrolling back up never re-triggers it.
 * Motion is skipped entirely under prefers-reduced-motion via the
 * global CSS override in base.css — no extra logic needed here.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

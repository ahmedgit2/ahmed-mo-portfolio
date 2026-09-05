import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

type Shot = { base: string; key: string };

// Each image has an Arabic original (the real marketing render, on-image
// text included) and an "-en" twin with only that on-image text redrawn in
// English — everything else (screenshots, photos, layout) is identical.
// Arabic viewers see the original; every other locale sees the English one.
const SHOTS: Shot[] = [
  { base: 'chef-ruler-client', key: 'chefRulerClient' },
  { base: 'chef-ruler-provider', key: 'chefRulerProvider' },
  { base: 'chef-ruler-menu', key: 'chefRulerMenu' },
  { base: 'geet-client', key: 'geetClient' },
  { base: 'geet-provider', key: 'geetProvider' },
  { base: 'flow-dashboard', key: 'flowDashboard' },
  { base: 'flow-ledger', key: 'flowLedger' },
  { base: 'responsive', key: 'responsive' },
];

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isArabic = i18n.language === 'ar';
  const srcFor = (base: string) => `/images/gallery/${base}${isArabic ? '' : '-en'}.jpg`;

  const open = openIndex !== null ? SHOTS[openIndex] : null;

  return (
    <section id="gallery">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <div className="sec-head">
          <h2>{t('gallery.heading')}</h2>
          <p className="sec-sub">{t('gallery.subheading')}</p>
        </div>
        <div className="gallery-grid">
          {SHOTS.map((shot, i) => (
            <button
              type="button"
              className="gallery-item"
              key={shot.base}
              onClick={() => setOpenIndex(i)}
            >
              <img src={srcFor(shot.base)} alt={t(`gallery.items.${shot.key}`)} loading="lazy" />
              <span className="gallery-caption">{t(`gallery.items.${shot.key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setOpenIndex(null)}>
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
          >
            ✕
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={srcFor(open.base)} alt={t(`gallery.items.${open.key}`)} />
            <figcaption>{t(`gallery.items.${open.key}`)}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

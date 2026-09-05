import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

type Shot = { src: string; key: string };

const SHOTS: Shot[] = [
  { src: '/images/gallery/chef-ruler-client.jpg', key: 'chefRulerClient' },
  { src: '/images/gallery/chef-ruler-provider.jpg', key: 'chefRulerProvider' },
  { src: '/images/gallery/geet-client.jpg', key: 'geetClient' },
  { src: '/images/gallery/geet-provider.jpg', key: 'geetProvider' },
  { src: '/images/gallery/flow-dashboard.jpg', key: 'flowDashboard' },
  { src: '/images/gallery/flow-ledger.jpg', key: 'flowLedger' },
  { src: '/images/gallery/flow-invoicing.jpg', key: 'flowInvoicing' },
  { src: '/images/gallery/responsive.jpg', key: 'responsive' },
];

export default function Gallery() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
              key={shot.src}
              onClick={() => setOpenIndex(i)}
            >
              <img src={shot.src} alt={t(`gallery.items.${shot.key}`)} loading="lazy" />
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
            <img src={open.src} alt={t(`gallery.items.${open.key}`)} />
            <figcaption>{t(`gallery.items.${open.key}`)}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

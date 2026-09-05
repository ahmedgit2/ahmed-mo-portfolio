import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero from './Hero';

const QUICK_LINKS = [
  { to: '/work', ns: 'work' },
  { to: '/demos', ns: 'demos' },
  { to: '/experience', ns: 'experience' },
  { to: '/skills', ns: 'skills' },
  { to: '/contact', ns: 'contact' },
] as const;

// Landing page: Hero, then a quick-nav grid to the rest of the site. Reuses
// each section's own heading/subheading (already translated everywhere)
// instead of introducing new copy just for these cards.
export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Hero />
      <section id="home-links">
        <div className="wrap">
          <div className="quick-list">
            {QUICK_LINKS.map((q, i) => (
              <Link className="quick-row" to={q.to} key={q.to}>
                <span className="quick-row-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="quick-row-text">
                  <span className="quick-row-title">{t(`${q.ns}.heading`)}</span>
                  <span className="quick-row-sub">{t(`${q.ns}.subheading`)}</span>
                </span>
                <span className="quick-row-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

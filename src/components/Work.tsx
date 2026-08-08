import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

type Project = {
  icon: string;
  alt: string;
  title: string;
  descKey: string;
  playStore?: string;
  appStore?: string;
};

const PROJECTS: Project[] = [
  {
    icon: '/images/icons/planradar.jpg',
    alt: 'PlanRadar app icon',
    title: 'PlanRadar',
    descKey: 'planradar',
    playStore: 'https://play.google.com/store/apps/details?id=com.defectradar',
    appStore: 'https://apps.apple.com/us/app/planradar-construction-manager/id720159081',
  },
  {
    icon: '/images/icons/chefruler.jpg',
    alt: 'Chef Ruler — Client app icon',
    title: 'Chef Ruler — Client',
    descKey: 'chefRulerClient',
    playStore: 'https://play.google.com/store/apps/details?id=com.index.chefruler.client',
    appStore: 'https://apps.apple.com/us/app/%D8%B4%D9%8A%D9%81-%D8%B1%D9%88%D9%84%D8%B1/id1464885006',
  },
  {
    icon: '/images/icons/geet-client.jpg',
    alt: 'Geet — Client app icon',
    title: 'Geet — Client',
    descKey: 'geetClient',
    playStore: 'https://play.google.com/store/apps/details?id=com.courierclient',
    appStore: 'https://apps.apple.com/us/app/geet-order-delivery/id1526982727',
  },
  {
    icon: '/images/icons/geet-driver.jpg',
    alt: 'Geet — Provider app icon',
    title: 'Geet — Provider',
    descKey: 'geetProvider',
    playStore: 'https://play.google.com/store/apps/details?id=com.courierprovider',
    appStore: 'https://apps.apple.com/us/app/geeet-provider/id1526993844',
  },
  {
    icon: '/images/icons/flow.jpg',
    alt: 'Flow app icon',
    title: 'Flow',
    descKey: 'flow',
    playStore: 'https://play.google.com/store/apps/details?id=com.index.flow.owner',
    appStore: 'https://apps.apple.com/us/app/flow-pos/id6544797811',
  },
  {
    icon: '/images/icons/sanabel.jpg',
    alt: 'Sanabel app icon',
    title: 'Sanabel',
    descKey: 'sanabel',
    playStore: 'https://play.google.com/store/apps/details?id=com.sanabel',
  },
];

export default function Work() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="work">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <div className="sec-head">
          <h2>{t('work.heading')}</h2>
          <p className="sec-sub">{t('work.subheading')}</p>
        </div>
        <div className="projects">
          {PROJECTS.map((p) => (
            <div className="card" key={p.title}>
              <div className="card-head">
                <img className="card-icon" src={p.icon} alt={p.alt} loading="lazy" />
                <div className="card-title" style={{ marginBottom: 0 }}>{p.title}</div>
              </div>
              <div className="card-desc">{t(`work.projects.${p.descKey}`)}</div>
              <div className="card-links">
                {p.playStore && <a href={p.playStore} target="_blank" rel="noopener">Google Play ↗</a>}
                {p.appStore && <a href={p.appStore} target="_blank" rel="noopener">App Store ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

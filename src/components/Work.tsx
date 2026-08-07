type Project = {
  icon: string;
  alt: string;
  title: string;
  desc: string;
  playStore?: string;
  appStore?: string;
};

const PROJECTS: Project[] = [
  {
    icon: '/images/icons/planradar.jpg',
    alt: 'PlanRadar app icon',
    title: 'PlanRadar',
    desc: 'Construction & real-estate SaaS. RN module embedded inside native iOS/Android host apps, packaged as a versioned binary.',
    playStore: 'https://play.google.com/store/apps/details?id=com.defectradar',
    appStore: 'https://apps.apple.com/us/app/planradar-construction-manager/id720159081',
  },
  {
    icon: '/images/icons/chefruler.jpg',
    alt: 'Chef Ruler — Client app icon',
    title: 'Chef Ruler — Client',
    desc: 'Ordering platform connecting users with home-cooked meals from local chefs.',
    playStore: 'https://play.google.com/store/apps/details?id=com.index.chefruler.client',
    appStore: 'https://apps.apple.com/us/app/%D8%B4%D9%8A%D9%81-%D8%B1%D9%88%D9%84%D8%B1/id1464885006',
  },
  {
    icon: '/images/icons/geet-client.jpg',
    alt: 'Geet — Client app icon',
    title: 'Geet — Client',
    desc: 'Consumer delivery app for stores, packages, and on-demand courier requests.',
    playStore: 'https://play.google.com/store/apps/details?id=com.courierclient',
    appStore: 'https://apps.apple.com/us/app/geet-order-delivery/id1526982727',
  },
  {
    icon: '/images/icons/geet-driver.jpg',
    alt: 'Geet — Provider app icon',
    title: 'Geet — Provider',
    desc: 'Provider-side app for managing delivery offers, routing, and order handoff.',
    playStore: 'https://play.google.com/store/apps/details?id=com.courierprovider',
    appStore: 'https://apps.apple.com/us/app/geeet-provider/id1526993844',
  },
  {
    icon: '/images/icons/flow.jpg',
    alt: 'Flow app icon',
    title: 'Flow',
    desc: 'Inventory management app built to improve day-to-day operational efficiency.',
    playStore: 'https://play.google.com/store/apps/details?id=com.index.flow.owner',
    appStore: 'https://apps.apple.com/us/app/flow-pos/id6544797811',
  },
  {
    icon: '/images/icons/sanabel.jpg',
    alt: 'Sanabel app icon',
    title: 'Sanabel',
    desc: 'Connects users with community charitable initiatives in need of support.',
    playStore: 'https://play.google.com/store/apps/details?id=com.sanabel',
  },
];

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head">
          <h2>Shipped Apps</h2>
          <p className="sec-sub">Production apps live on the App Store and Google Play.</p>
        </div>
        <div className="projects">
          {PROJECTS.map((p) => (
            <div className="card" key={p.title}>
              <div className="card-head">
                <img className="card-icon" src={p.icon} alt={p.alt} loading="lazy" />
                <div className="card-title" style={{ marginBottom: 0 }}>{p.title}</div>
              </div>
              <div className="card-desc">{p.desc}</div>
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

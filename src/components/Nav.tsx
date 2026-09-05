import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../sharedComponents/LanguageSwitcher';

const ROUTES: { path: string; key: string; end?: boolean }[] = [
  { path: '/', key: 'home', end: true },
  { path: '/work', key: 'work' },
  { path: '/demos', key: 'demos' },
  { path: '/experience', key: 'experience' },
  { path: '/skills', key: 'skills' },
  { path: '/contact', key: 'contact' },
];

export default function Nav() {
  const { t } = useTranslation();

  return (
    <nav>
      <div className="wrap">
        <NavLink to="/" className="brand" style={{ textDecoration: 'none' }}>
          AHMED<span>.</span>MOHAMED
        </NavLink>
        <div className="nav-right">
          <div className="links">
            {ROUTES.map((r) => (
              <NavLink
                key={r.path}
                to={r.path}
                end={r.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t(`nav.${r.key}`)}
              </NavLink>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

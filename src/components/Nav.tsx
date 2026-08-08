import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '../hooks/useScrollSpy';
import LanguageSwitcher from '../sharedComponents/LanguageSwitcher';

const SECTION_IDS = ['work', 'demos', 'experience', 'contact'] as const;

export default function Nav() {
  const { t } = useTranslation();
  const activeId = useScrollSpy([...SECTION_IDS]);

  return (
    <nav>
      <div className="wrap">
        <div className="brand">AHMED<span>.</span>MOHAMED</div>
        <div className="nav-right">
          <div className="links">
            {SECTION_IDS.map((id) => (
              <a key={id} href={`#${id}`} className={activeId === id ? 'active' : ''}>
                {t(`nav.${id}`)}
              </a>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

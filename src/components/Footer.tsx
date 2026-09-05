import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Persistent footer — stays fixed at the bottom of every page (Home, Work,
// Demos, Experience, Skills, Contact) while the nav swaps the routed page
// content above it. On /contact the same links already sit at the top of
// the page content, so the footer skips repeating them here.
export default function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onContactPage = pathname === '/contact';

  return (
    <footer>
      <div className="wrap">
        {!onContactPage && (
          <div className="contact-links">
            <a href="mailto:ahmedmoh6000@gmail.com">ahmedmoh6000@gmail.com</a>
            <a href="tel:+201009014257">+20 100 901 4257</a>
            <a href="https://linkedin.com/in/ahmedmoh93" target="_blank" rel="noopener">linkedin.com/in/ahmedmoh93</a>
            <a href="https://drive.google.com/file/d/1K3tBjxUeA9meo1oZS4ON49f2QGjOXwTN/view?usp=drive_link" target="_blank" rel="noopener">{t('contact.resumeLabel')}</a>
          </div>
        )}
        <div className="foot-note">{t('contact.footnote')}</div>
      </div>
    </footer>
  );
}

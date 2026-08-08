import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <footer id="contact">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <h2 className="big">{t('contact.heading')}</h2>
        <p className="sub">{t('contact.subheading')}</p>
        <div className="contact-links">
          <a href="mailto:ahmedmoh6000@gmail.com">ahmedmoh6000@gmail.com</a>
          <a href="tel:+201009014257">+20 100 901 4257</a>
          <a href="https://linkedin.com/in/ahmedmoh93" target="_blank" rel="noopener">linkedin.com/in/ahmedmoh93</a>
          <a href="https://drive.google.com/file/d/1K3tBjxUeA9meo1oZS4ON49f2QGjOXwTN/view?usp=drive_link" target="_blank" rel="noopener">{t('contact.resumeLabel')}</a>
        </div>
        <div className="foot-note">{t('contact.footnote')}</div>
      </div>
    </footer>
  );
}

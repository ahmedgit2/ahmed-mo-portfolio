import { Trans, useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

type Layer = { name: string; detail: string; tag: string };

export default function Hero() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const layers = t('hero.layers', { returnObjects: true }) as Layer[];

  return (
    <header className="hero">
      <div className="wrap">
        <div className="eyebrow">{t('hero.eyebrow')}</div>
        <h1>
          {t('hero.h1Line1')}
          <br />
          {t('hero.h1Pre')}<span className="accent">{t('hero.h1Accent')}</span>.
        </h1>
        <p className="tagline">
          <Trans i18nKey="hero.tagline" components={[<b className="accent" key="accent" />]} />
        </p>

        <div className="cta-row">
          <a className="btn btn-primary" href="#demos">{t('hero.ctaPrimary')}</a>
          <a className="btn btn-ghost" href="mailto:ahmedmoh6000@gmail.com">{t('hero.ctaSecondary')}</a>
        </div>

        {/* Deeper technical detail for engineers reviewing the stack */}
        <div
          className={'stack reveal' + (visible ? ' visible' : '')}
          ref={ref}
          role="img"
          aria-label={t('demoUI.heroDiagramAriaLabel')}
        >
          <div className="stack-label">{t('hero.stackLabel')}</div>
          <div className="layer-grid">
            {layers.map((layer) => (
              <div className="layer" key={layer.name}>
                <span className="layer-name">{layer.name}</span>
                <div className="layer-detail">{layer.detail}</div>
                <span className="layer-tag">{layer.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

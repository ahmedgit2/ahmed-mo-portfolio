import { useTranslation } from 'react-i18next';
import { useReveal } from '../hooks/useReveal';

type Job = { role: string; period: string; meta: string; bullets: string[] };

export default function Experience() {
  const { t } = useTranslation();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];

  return (
    <section id="experience">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <div className="sec-head">
          <h2>{t('experience.heading')}</h2>
          <p className="sec-sub">{t('experience.subheading')}</p>
        </div>
        {jobs.map((job) => (
          <div className="job" key={job.role}>
            <div className="job-head">
              <span className="job-role">{job.role}</span>
              <span className="job-period">{job.period}</span>
            </div>
            <div className="job-meta">{job.meta}</div>
            <ul>
              {job.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useReveal } from '../hooks/useReveal';

type Job = {
  role: string;
  period: string;
  meta: string;
  bullets: string[];
};

const JOBS: Job[] = [
  {
    role: 'React Native Engineer — PlanRadar',
    period: 'Sept 2024 — Present',
    meta: 'Remote (Vienna, Austria) · Construction & real-estate SaaS',
    bullets: [
      "Co-architected React Native's packaging as a versioned native binary (XCFramework + AAR), removing the Node/Yarn toolchain requirement for native teams.",
      'Led platform migration to React Native 0.85, enabling Hermes and the New Architecture (TurboModules/Fabric).',
      'Fixed a critical rendering bottleneck — replaced an O(n²) re-render path with an O(1) lookup.',
      'Refactored persistence from AsyncStorage to MMKV; split a monolithic context into domain-specific contexts.',
      'Built the in-app AI Assistant: ActionCable-streamed staged responses (thinking/response), ticket & document context injection, AI-index status tracking, and usage-tier gating with upgrade flow.',
    ],
  },
  {
    role: 'React Native Developer — Index Group',
    period: 'Nov 2021 — Aug 2024',
    meta: 'On-site (Ismailia, Egypt) · E-commerce & logistics',
    bullets: [
      'Cut API response times by 40% under heavy data loads through fetching-strategy optimization.',
      'Designed a modular folder structure that reduced code maintenance time by 30%.',
      'Integrated push notifications, deep linking, Universal Links, and chat functionality across production apps.',
    ],
  },
  {
    role: 'Windows Application Developer — Micro Arabs',
    period: 'Aug 2020 — Nov 2021',
    meta: 'Remote (Iraq) · Enterprise desktop systems',
    bullets: [
      'Built enterprise desktop applications with C#, WinForms, and DevExpress.',
      'Optimized SQL Server queries and integrated real-time communication via RestSharp and Twilio.',
    ],
  },
];

export default function Experience() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="experience">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={ref}>
        <div className="sec-head">
          <h2>Experience</h2>
          <p className="sec-sub">Six years across mobile, e-commerce, logistics, and enterprise desktop systems.</p>
        </div>
        {JOBS.map((job) => (
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

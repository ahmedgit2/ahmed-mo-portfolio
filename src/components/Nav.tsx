import { useScrollSpy } from '../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'demos', label: 'Demos' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const activeId = useScrollSpy(SECTIONS.map((s) => s.id));

  return (
    <nav>
      <div className="wrap">
        <div className="brand">AHMED<span>.</span>MOHAMED</div>
        <div className="links">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={activeId === s.id ? 'active' : ''}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

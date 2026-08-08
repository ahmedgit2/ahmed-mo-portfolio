import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { DEMO_LIST } from '../sharedComponents/registry';
import ListPerfDemo from '../demos/ListPerfDemo';
import StorageDemo from '../demos/StorageDemo';
import SyncDemo from '../demos/SyncDemo';
import AnimDemo from '../demos/AnimDemo';
import DeepLinkDemo from '../demos/DeepLinkDemo';
import ULinkDemo from '../demos/ULinkDemo';
import PushDemo from '../demos/PushDemo';
import CicdDemo from '../demos/CicdDemo';
import I18nDemo from '../demos/I18nDemo';
import NewArchDemo from '../demos/NewArchDemo';
import ReleaseDemo from '../demos/ReleaseDemo';
import TestingDemo from '../demos/TestingDemo';
import OtaDemo from '../demos/OtaDemo';
import TvDemo from '../demos/TvDemo';
import WearablesDemo from '../demos/WearablesDemo';
import AiAssistantDemo from '../demos/AiAssistantDemo';

const DEMO_COMPONENTS: Record<string, React.ComponentType> = {
  list: ListPerfDemo,
  storage: StorageDemo,
  sync: SyncDemo,
  anim: AnimDemo,
  deeplink: DeepLinkDemo,
  ulink: ULinkDemo,
  push: PushDemo,
  cicd: CicdDemo,
  i18n: I18nDemo,
  newarch: NewArchDemo,
  release: ReleaseDemo,
  testing: TestingDemo,
  ota: OtaDemo,
  tv: TvDemo,
  wearables: WearablesDemo,
  aiassistant: AiAssistantDemo,
};

const DESKTOP_BREAKPOINT = 820; // matches .demos-layout single-column breakpoint in demos.css

export default function DemosSection() {
  const [activeId, setActiveId] = useState(DEMO_LIST[0].id);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);
  const ActiveDemo = DEMO_COMPONENTS[activeId];
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>();

  // Every demo panel matches the sidebar's height exactly — measured, not guessed,
  // so it stays correct regardless of how tall any individual demo's content is.
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    function syncHeight() {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        setPanelHeight(undefined); // sidebar stacks above the panel on mobile — no forced height
        return;
      }
      setPanelHeight(sidebar!.offsetHeight);
    }

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(sidebar);
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

  return (
    <section id="demos">
      <div className={'wrap reveal' + (visible ? ' visible' : '')} ref={revealRef}>
        <div className="sec-head">
          <h2>Skill Demos</h2>
          <p className="sec-sub">Live, interactive — not screenshots. Each one maps to real work from my experience.</p>
        </div>

        <div className="demos-layout">
          <div className="demo-sidebar" role="tablist" aria-orientation="vertical" ref={sidebarRef}>
            {DEMO_LIST.map((d) => (
              <button
                key={d.id}
                className={'demo-sidebar-btn' + (activeId === d.id ? ' active' : '')}
                role="tab"
                aria-selected={activeId === d.id}
                onClick={() => setActiveId(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="tab-panel active" style={panelHeight ? { height: panelHeight } : undefined}>
            <ActiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

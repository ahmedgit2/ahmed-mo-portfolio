import { useState } from 'react';
import { DEMO_LIST } from '../demos/types';
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
import MultiDeviceDemo from '../demos/MultiDeviceDemo';
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
  multidevice: MultiDeviceDemo,
  aiassistant: AiAssistantDemo,
};

export default function DemosSection() {
  const [activeId, setActiveId] = useState(DEMO_LIST[0].id);
  const ActiveDemo = DEMO_COMPONENTS[activeId];

  return (
    <section id="demos">
      <div className="wrap">
        <div className="sec-head">
          <h2>Skill Demos</h2>
          <p className="sec-sub">Live, interactive — not screenshots. Each one maps to real work from my experience.</p>
        </div>

        <div className="demos-layout">
          <div className="demo-sidebar" role="tablist" aria-orientation="vertical">
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

          <div className="tab-panel active">
            <ActiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

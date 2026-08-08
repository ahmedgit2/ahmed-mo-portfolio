import { useState } from 'react';

export type CodeFile = { name: string; code: string };

/**
 * File-tab code viewer — shows the filename each snippet actually lives in
 * (RN, iOS, Android, package.json...) instead of one anonymous code block.
 */
export default function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="code-tabs">
      <div className="code-tabs-bar" role="tablist">
        {files.map((f, i) => (
          <button
            key={f.name}
            className={'code-tab-btn' + (i === active ? ' active' : '')}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            {f.name}
          </button>
        ))}
      </div>
      <pre className="code-block">{files[active].code}</pre>
    </div>
  );
}

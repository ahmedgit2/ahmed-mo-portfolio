import { useMemo, useState } from 'react';
import { highlightLine } from './highlight';

export type CodeFile = { name: string; code: string };

/**
 * File-tab code viewer — shows the filename each snippet actually lives in
 * (RN, iOS, Android, package.json...) with line numbers and lightweight
 * syntax highlighting, instead of one anonymous flat code block.
 */
export default function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);

  const lines = useMemo(() => files[active].code.split('\n'), [files, active]);

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
      <pre className="code-block">
        <code>
          {lines.map((line, i) => (
            <div className="code-line" key={i}>
              <span className="code-line-no">{i + 1}</span>
              <span className="code-line-content" dangerouslySetInnerHTML={{ __html: highlightLine(line) || ' ' }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

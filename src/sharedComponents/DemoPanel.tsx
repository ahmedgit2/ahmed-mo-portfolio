import type { ReactNode } from 'react';

type DemoPanelProps = {
  desc: string;
  note: string;
  children: ReactNode; // exactly two children: the demo-box and the code-block
};

/**
 * Shared layout for every skill-demo panel: description, a two-column
 * demo-box/code-block grid, then a closing note. Keeps all 15 demos
 * consistent without repeating the same three wrapper elements everywhere.
 */
export default function DemoPanel({ desc, note, children }: DemoPanelProps) {
  return (
    <>
      <p className="tab-desc">{desc}</p>
      <div className="demo-grid">{children}</div>
      <div className="demo-note">{note}</div>
    </>
  );
}

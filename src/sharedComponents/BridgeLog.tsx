import type { LogLine } from './useStagedLog';

type BridgeLogProps = {
  lines: LogLine[];
  placeholder: string;
  minHeight?: number;
  style?: React.CSSProperties;
};

/** The dim scrolling trace box every "simulate a native round trip" demo uses. */
export default function BridgeLog({ lines, placeholder, minHeight, style }: BridgeLogProps) {
  return (
    <div className="bridge-log" style={{ minHeight, ...style }}>
      {lines.length === 0 && placeholder}
      {lines.map((line, i) => <div key={i} className={line.kind}>{line.text}</div>)}
    </div>
  );
}

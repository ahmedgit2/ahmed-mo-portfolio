// Tiny zero-dependency syntax highlighter — covers the languages used across
// the demo snippets (TS/JS, bash, YAML, XML, JSON, Gradle, Markdown) well
// enough for a code preview. Not a real grammar, just comments/strings/
// keywords/numbers — the four things that make a snippet readable at a glance.

const KEYWORDS = [
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case',
  'break', 'continue', 'class', 'extends', 'implements', 'interface', 'type', 'enum', 'import',
  'export', 'from', 'as', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new',
  'this', 'super', 'typeof', 'instanceof', 'in', 'of', 'public', 'private', 'protected', 'readonly',
  'static', 'void', 'null', 'undefined', 'true', 'false', 'yield', 'delete', 'do', 'get', 'set',
  // shell / yaml / gradle / config-ish
  'stage', 'stages', 'script', 'rules', 'needs', 'when', 'manual', 'implementation', 'dependencies',
  'target', 'pod', 'set', 'echo',
];

const KEYWORD_RE = new RegExp(`\\b(?:${KEYWORDS.join('|')})\\b`);

const TOKEN_RE = new RegExp(
  [
    '(//.*|<!--[\\s\\S]*?-->|/\\*[\\s\\S]*?\\*/|^[ \\t]*#.*$)', // 1: comment
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)', // 2: string
    `\\b(${KEYWORDS.join('|')})\\b`, // 3: keyword
    '\\b(\\d+\\.?\\d*)\\b', // 4: number
  ].join('|'),
  'gm',
);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Highlights a single line of code, returning safe HTML with token spans. */
export function highlightLine(line: string): string {
  const escaped = escapeHtml(line);
  return escaped.replace(TOKEN_RE, (match, comment, str, kw) => {
    if (comment !== undefined) return `<span class="tok-cm">${match}</span>`;
    if (str !== undefined) return `<span class="tok-str">${match}</span>`;
    if (kw !== undefined && KEYWORD_RE.test(kw)) return `<span class="tok-kw">${match}</span>`;
    return `<span class="tok-num">${match}</span>`;
  });
}

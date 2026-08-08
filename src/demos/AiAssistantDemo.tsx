import { useState } from 'react';
import DemoPanel from './shared/DemoPanel';
import CodeTabs from './shared/CodeTabs';

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'ai'; html: string }
  | { role: 'thinking' };

type PromptKey = 'overdue' | 'summary' | 'similar';

const PROMPTS: Record<PromptKey, { question: string; answerHtml: string; label: string }> = {
  overdue: {
    label: 'Overdue tickets',
    question: 'Show me overdue tickets on this project',
    answerHtml:
      'Found <b>3 overdue tickets</b> on this project, all assigned to you.' +
      '<div class="chat-ticket-chip">🎫 TICKET-4821 · Roof leak, west wing</div>',
  },
  summary: {
    label: 'Summarize this project',
    question: 'Summarize this project',
    answerHtml:
      '<b>West Tower Renovation</b> — 42 tickets total, 34 resolved, 8 open. ' +
      '2 documents pending review, on track for the March 15 milestone.' +
      '<div class="chat-ticket-chip">📄 site-inspection-report.pdf</div>',
  },
  similar: {
    label: 'Find similar past issues',
    question: 'Find similar past issues',
    answerHtml:
      'Found <b>2 similar issues</b> from past projects — same root cause (flashing gap).' +
      '<div class="chat-ticket-chip">🎫 TICKET-2210 · East wing, resolved</div>',
  },
};

const MAX_USAGE = 50;

export default function AiAssistantDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [usage, setUsage] = useState(12);

  function ask(key: PromptKey) {
    if (busy) return;
    const prompt = PROMPTS[key];
    setBusy(true);
    setMessages([{ role: 'user', text: prompt.question }, { role: 'thinking' }]);
    setTimeout(() => {
      setMessages([{ role: 'user', text: prompt.question }, { role: 'ai', html: prompt.answerHtml }]);
      setUsage((u) => Math.min(MAX_USAGE, u + 1));
      setBusy(false);
    }, 1100);
  }

  return (
    <DemoPanel
      desc="PlanRadar's in-app AI Assistant — I built the RN client: WebSocket-streamed staged responses (thinking → response), ticket/document context attachments, and usage-tier gating. Architecture below, renamed from the real implementation. Pick a prompt below."
      note="// Streamed over WebSockets, not polled — the thinking stage renders while the model is still working."
    >
      <div className="demo-box">
        <div className="chat-box">
          {messages.length === 0 && (
            <div className="chat-msg ai" style={{ opacity: 0.7 }}>Ask me about this project — try a prompt below.</div>
          )}
          {messages.map((m, i) => {
            if (m.role === 'user') return <div className="chat-msg user" key={i}>{m.text}</div>;
            if (m.role === 'thinking') {
              return (
                <div className="chat-thinking" key={i}>
                  <span /><span /><span />
                </div>
              );
            }
            return <div className="chat-msg ai" key={i} dangerouslySetInnerHTML={{ __html: m.html }} />;
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {(Object.keys(PROMPTS) as PromptKey[]).map((key) => (
            <button
              key={key}
              className="btn btn-ghost"
              style={{ padding: '8px 12px', fontSize: 12 }}
              disabled={busy}
              onClick={() => ask(key)}
            >
              {PROMPTS[key].label}
            </button>
          ))}
        </div>
        <div className="ai-usage-bar"><div className="ai-usage-fill" style={{ width: `${Math.round((usage / MAX_USAGE) * 100)}%` }} /></div>
        <div className="ai-usage-label">{usage} / {MAX_USAGE} messages this cycle</div>
      </div>
      <CodeTabs
        files={[
          {
            name: 'parseChatReply.ts',
            code: `// backend streams staged JSON, not raw markdown, so the UI can show
// "thinking" separately from the final answer
type ReplyStage = { stage: 'pending' | 'final' | 'suggestedActions'; text: string };

export function parseChatReply(raw: string | null): string | null {
  if (!raw) return null;
  const stages: ReplyStage[] = JSON.parse(raw);

  return stages
    .filter((s) => s.stage === 'final' || s.stage === 'pending') // skip web-only action stage
    .map((stage) =>
      stage.stage === 'pending'
        ? \`<pending-block>\${stage.text}</pending-block>\` // collapsible "thinking" UI
        : stage.text, // plain markdown + a few custom XML tags, rendered as-is
    )
    .join('');
}`,
          },
          {
            name: 'useChatSocket.ts',
            code: `// one WebSocket subscription per chat session
export function useChatSocket({ sessionId, onReceived, enabled = true }: Props) {
  useEffect(() => {
    if (!enabled || !sessionId) return;

    const channel = socketClient.subscribe(
      { channel: 'ChatUpdatesChannel', session_id: sessionId },
      { received: (data: ChatUpsertPayload) => onReceived(data) },
    );

    return () => channel.unsubscribe(); // one leaked subscription per screen visit adds up fast
  }, [sessionId, enabled]);
}

// upsert payload lets partial tokens patch the *same* message bubble
// instead of appending a new one per chunk — { id, text, done, failed }`,
          },
        ]}
      />
    </DemoPanel>
  );
}

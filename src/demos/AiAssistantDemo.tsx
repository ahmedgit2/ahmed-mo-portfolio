import { useState } from 'react';

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
    <>
      <p className="tab-desc">
        PlanRadar's in-app AI Assistant — I built the RN client: ActionCable-streamed staged responses
        (thinking → response), ticket/document context attachments, and usage-tier gating. Pick a prompt below.
      </p>
      <div className="demo-grid">
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
        <pre className="code-block">{`// processAnswer.ts — stage the raw backend JSON
const stages: AnswerStage[] = JSON.parse(rawAnswer);
const renderable = stages.filter(s =>
  s.state === 'Response' || s.state === 'Thinking');

return renderable.map(stage =>
  stage.state === 'Thinking'
    ? \`<thinking-placeholder>\${stage.output}</thinking-placeholder>\`
    : stage.output
).join('');

// use-assistant-cable.ts — ActionCable channel
const ASSISTANT_CHANNEL = 'AssistantMessageChannel';`}</pre>
      </div>
      <div className="demo-note">// Streamed over WebSockets, not polled — the thinking stage renders while the model is still working.</div>
    </>
  );
}

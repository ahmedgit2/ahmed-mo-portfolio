import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import BridgeLog from '../sharedComponents/BridgeLog';
import CodeTabs from '../sharedComponents/CodeTabs';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

export default function ReactWebDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(420);
  const [count, setCount] = useState(0);

  const STEPS: LogLine[] = [
    { text: t('demoUI.reactweb.step1'), kind: 'cur' },
    { text: t('demoUI.reactweb.step2'), kind: 'cur' },
    { text: t('demoUI.reactweb.step3'), kind: 'cur' },
    { text: t('demoUI.reactweb.step4'), kind: 'cur' },
    { text: t('demoUI.reactweb.step5'), kind: 'ok' },
  ];
  const hydrated = lines.length === STEPS.length;

  return (
    <DemoPanel
      desc={t('demoText.reactweb.desc')}
      note={t('demoText.reactweb.note')}
    >
      <div className="demo-box">
        <button
          className="btn btn-primary"
          style={{ padding: '9px 16px', marginBottom: 14 }}
          onClick={() => { run(STEPS); setCount(0); }}
        >
          {t('demoUI.reactweb.runButton')}
        </button>
        <BridgeLog lines={lines} placeholder={t('demoUI.reactweb.placeholder')} minHeight={STEPS.length * 23} />
        {hydrated && (
          <button
            className="btn btn-ghost"
            style={{ padding: '9px 16px', marginTop: 14 }}
            onClick={() => setCount((c) => c + 1)}
          >
            {t('demoUI.reactweb.hydratedButton', { count })}
          </button>
        )}
      </div>
      <CodeTabs
        files={[
          {
            name: 'app/tickets/[id]/page.tsx',
            code: `import { getTicket } from '@/lib/tickets';
import { TicketActions } from './TicketActions';

// Server Component — runs on the server only, its output is the HTML
// the browser paints first. No client JS ships for this part at all.
export default async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id);

  return (
    <article>
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <TicketActions ticketId={ticket.id} />
    </article>
  );
}`,
          },
          {
            name: 'app/tickets/[id]/TicketActions.tsx',
            code: `'use client'; // opts this one component into hydration — the boundary
                // is explicit, not the whole page

import { useState } from 'react';
import { approveTicket } from '@/lib/tickets';

export function TicketActions({ ticketId }: { ticketId: string }) {
  const [approving, setApproving] = useState(false);

  return (
    <button
      disabled={approving}
      onClick={async () => {
        setApproving(true);
        await approveTicket(ticketId);
        setApproving(false);
      }}
    >
      {approving ? 'Approving…' : 'Approve'}
    </button>
  );
}`,
          },
        ]}
      />
    </DemoPanel>
  );
}

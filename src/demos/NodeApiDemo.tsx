import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import PipelineSteps, { usePipeline } from '../sharedComponents/PipelineSteps';
import CodeTabs from '../sharedComponents/CodeTabs';

export default function NodeApiDemo() {
  const { t } = useTranslation();
  const STEPS = [
    t('demoUI.nodeapi.step1'),
    t('demoUI.nodeapi.step2'),
    t('demoUI.nodeapi.step3'),
    t('demoUI.nodeapi.step4'),
    t('demoUI.nodeapi.step5'),
  ];
  const { states, run } = usePipeline(STEPS, 550);

  return (
    <DemoPanel
      desc={t('demoText.nodeapi.desc')}
      note={t('demoText.nodeapi.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 16 }} onClick={run}>{t('demoUI.nodeapi.runButton')}</button>
        <PipelineSteps steps={STEPS} states={states} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'server.ts',
            code: `import express from 'express';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimit';
import { ticketsRouter } from './routes/tickets';

const app = express();
app.use(express.json());
app.use(authMiddleware);
app.use(rateLimiter({ windowMs: 60_000, max: 100 }));
app.use('/tickets', ticketsRouter);

app.listen(process.env.PORT ?? 3000);`,
          },
          {
            name: 'middleware/auth.ts',
            code: `import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'missing token' });

  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}`,
          },
          {
            name: 'routes/tickets.ts',
            code: `import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createTicket } from '../db/tickets';

export const ticketsRouter = Router();

ticketsRouter.post(
  '/',
  body('title').isString().notEmpty(),
  body('projectId').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // req.user was attached by authMiddleware — every handler downstream
    // of it can trust it's already verified, never re-checks the token
    const ticket = await createTicket({ ...req.body, createdBy: req.user.id });
    res.status(201).json(ticket);
  },
);`,
          },
        ]}
      />
    </DemoPanel>
  );
}

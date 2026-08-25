import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import CodeTabs from '../sharedComponents/CodeTabs';
import BridgeLog from '../sharedComponents/BridgeLog';
import { useStagedLog, type LogLine } from '../sharedComponents/useStagedLog';

const RESULT_ITEMS = ['item1', 'item2', 'item3'] as const;

export default function RestApiDemo() {
  const { t } = useTranslation();
  const { lines, run } = useStagedLog(450);

  const STEPS: LogLine[] = [
    { text: t('demoUI.restapi.step1'), kind: 'cur' },
    { text: t('demoUI.restapi.step2'), kind: 'cur' },
    { text: t('demoUI.restapi.step3'), kind: 'cur' },
    { text: t('demoUI.restapi.step4'), kind: 'ok' },
  ];
  const done = lines.length === STEPS.length;

  return (
    <DemoPanel
      desc={t('demoText.restapi.desc')}
      note={t('demoText.restapi.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 14 }} onClick={() => run(STEPS)}>{t('demoUI.restapi.fetchButton')}</button>
        <BridgeLog lines={lines} placeholder={t('demoUI.restapi.placeholder')} minHeight={STEPS.length * 23} />
        {done && (
          <div className="fake-list" style={{ marginTop: 14 }}>
            {RESULT_ITEMS.map((key) => (
              <div className="fake-row" key={key}>{t(`demoUI.restapi.${key}`)}</div>
            ))}
          </div>
        )}
      </div>
      <CodeTabs
        files={[
          {
            name: 'apiClient.ts',
            code: `import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.planradar-clone.example/v2', // renamed from the real host
  timeout: 15_000,
  headers: { 'Content-Type': 'application/vnd.api+json' }, // JSON:API
});

// interceptors registered in a separate module — keeps this file a pure,
// side-effect-free client definition that's trivial to unit test in isolation`,
          },
          {
            name: 'interceptors.ts',
            code: `import { apiClient } from './apiClient';
import { getAccessToken, refreshAccessToken } from './authStore';
import { ApiError } from './ApiError';

let refreshInFlight: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retried) {
      return Promise.reject(normalizeError(error));
    }

    // multiple requests can 401 at once — share one refresh call instead of
    // firing a refresh per request and racing each other for a new token
    refreshInFlight ??= refreshAccessToken().finally(() => { refreshInFlight = null; });
    const token = await refreshInFlight;

    config._retried = true;
    config.headers.Authorization = \`Bearer \${token}\`;
    return apiClient.request(config);
  },
);

function normalizeError(error: unknown) {
  // callers get one shape regardless of network failure, timeout, or a JSON:API
  // error payload — no if(error.response) else if(error.request) at every call site
  if (axios.isAxiosError(error)) {
    return new ApiError(
      error.response?.data?.errors?.[0]?.detail ?? error.message,
      error.response?.status,
    );
  }
  return error;
}`,
          },
          {
            name: 'useTickets.ts',
            code: `import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from './apiClient';
import type { ApiError } from './ApiError';

type Ticket = { id: string; title: string };
type State = { data: Ticket[] | null; loading: boolean; error: string | null };

export function useTickets(projectId: string) {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null });

  const fetchTickets = useCallback(async () => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    try {
      const res = await apiClient.get(\`/projects/\${projectId}/tickets\`, { signal: controller.signal });
      setState({ data: res.data.data, loading: false, error: null });
    } catch (err) {
      if (axios.isCancel(err)) return; // unmounted mid-request, not a real failure
      setState({ data: null, loading: false, error: (err as ApiError).message });
    }
    return () => controller.abort();
  }, [projectId]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  return { ...state, refetch: fetchTickets };
}`,
          },
          {
            name: 'TicketList.tsx',
            code: `export function TicketList({ projectId }: { projectId: string }) {
  const { data, loading, error, refetch } = useTickets(projectId);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;

  return (
    <FlatList
      data={data}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TicketRow ticket={item} />}
    />
  );
}

// the component only ever sees { data, loading, error } — auth headers,
// retry-on-401, and error-shape normalization all happen below this line,
// never re-implemented per screen`,
          },
        ]}
      />
    </DemoPanel>
  );
}

export type DemoMeta = {
  id: string;
  label: string;
};

export const DEMO_LIST: DemoMeta[] = [
  { id: 'list', label: 'List Perf' },
  { id: 'storage', label: 'Offline Storage' },
  { id: 'sync', label: 'Offline-First Sync' },
  { id: 'anim', label: 'Animations' },
  { id: 'deeplink', label: 'Deep Linking' },
  { id: 'ulink', label: 'Universal Links' },
  { id: 'push', label: 'Push Notifications' },
  { id: 'cicd', label: 'CI/CD Pipeline' },
  { id: 'i18n', label: 'Localization' },
  { id: 'newarch', label: 'New Architecture' },
  { id: 'release', label: 'Native Binary Release' },
  { id: 'testing', label: 'Test Suite' },
  { id: 'ota', label: 'CodePush OTA' },
  { id: 'tv', label: 'Smart TV' },
  { id: 'wearables', label: 'Wearables' },
  { id: 'aiassistant', label: 'AI Assistant' },
];

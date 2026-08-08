// Order of the demo sidebar. Labels live in the i18n translation files
// (demos.labels.<id>) so the sidebar stays localized.
//
// Ordered deliberately, not alphabetically: lead with the two most visually
// striking demos to hook attention, then group by theme (core RN skills →
// data layer → architecture → navigation → engagement → i18n → release
// tooling), ending with the experimental no-shipped-app demos.
export const DEMO_IDS = [
  'gesture',
  'aiassistant',
  'list',
  'anim',
  'sync',
  'storage',
  'newarch',
  'deeplink',
  'ulink',
  'push',
  'i18n',
  'cicd',
  'release',
  'testing',
  'ota',
  'tv',
  'wearables',
] as const;

export type DemoId = (typeof DEMO_IDS)[number];

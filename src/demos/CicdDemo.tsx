import DemoPanel from '../sharedComponents/DemoPanel';
import PipelineSteps, { usePipeline } from '../sharedComponents/PipelineSteps';
import CodeTabs from '../sharedComponents/CodeTabs';

const STEPS = ['Install deps', 'Run tests (Jest)', 'EAS Build (iOS + Android)', 'Submit → TestFlight', 'Submit → Play Console'];

export default function CicdDemo() {
  const { states, run } = usePipeline(STEPS, 650);

  return (
    <DemoPanel
      desc="Full release ownership at PlanRadar and Index Group — GitLab CI/CD, EAS Build, TestFlight, and Play Console. Run the pipeline below."
      note="// Same pipeline shape across both apps: test → build → submit, gated on green tests."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 16 }} onClick={run}>Run pipeline</button>
        <PipelineSteps steps={STEPS} states={states} />
      </div>
      <CodeTabs
        files={[
          {
            name: '.gitlab-ci.yml',
            code: `stages: [install, test, build, deploy]

install:
  stage: install
  script: yarn install --frozen-lockfile
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths: [node_modules/]

test:
  stage: test
  script:
    - yarn lint
    - yarn tsc --noEmit
    - yarn test --coverage --ci
  coverage: '/All files[^|]*\\|[^|]*\\s+([\\d.]+)/'
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

build_ios:
  stage: build
  script: eas build -p ios --profile production --non-interactive
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/

build_android:
  stage: build
  script: eas build -p android --profile production --non-interactive
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/

deploy_testflight:
  stage: deploy
  script: eas submit -p ios --latest --non-interactive
  needs: [build_ios]
  when: manual # release owner promotes after smoke-testing the build

deploy_play:
  stage: deploy
  script: eas submit -p android --latest --non-interactive
  needs: [build_android]
  when: manual`,
          },
          {
            name: 'eas.json',
            code: `{
  "build": {
    "production": {
      "node": "20.11.0",
      "ios": { "resourceClass": "m-medium", "autoIncrement": true },
      "android": { "buildType": "app-bundle", "autoIncrement": true },
      "env": { "APP_ENV": "production" }
    },
    "staging": {
      "extends": "production",
      "distribution": "internal",
      "env": { "APP_ENV": "staging" }
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "release@company.com", "ascAppId": "0000000000" }
    }
  }
}`,
          },
        ]}
      />
    </DemoPanel>
  );
}

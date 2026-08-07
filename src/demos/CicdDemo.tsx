import DemoPanel from './DemoPanel';
import PipelineSteps, { usePipeline } from './PipelineSteps';

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
      <pre className="code-block">{`# .gitlab-ci.yml (simplified)
stages: [test, build, deploy]

test:
  script: yarn test --coverage

build_ios:
  script: eas build -p ios --profile production

deploy_testflight:
  script: eas submit -p ios --latest

deploy_play:
  script: eas submit -p android --latest`}</pre>
    </DemoPanel>
  );
}

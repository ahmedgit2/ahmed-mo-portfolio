import DemoPanel from './DemoPanel';
import PipelineSteps, { usePipeline } from './PipelineSteps';

const STEPS = ['Bump version → 4.12.0', 'Build XCFramework (iOS)', 'Build AAR (Android)', 'Publish to internal registry', 'Native teams consume via SPM/Gradle'];

export default function ReleaseDemo() {
  const { states, run } = usePipeline(STEPS, 550);

  return (
    <DemoPanel
      desc="Co-architected RN's packaging as a versioned native binary (XCFramework + AAR) — decoupling the RN layer from native host apps, no Node/Yarn toolchain required for native teams."
      note="// Native teams bump one version string — no RN toolchain install, no Metro, no Yarn."
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 16 }} onClick={run}>Cut release v4.12.0</button>
        <PipelineSteps steps={STEPS} states={states} />
      </div>
      <pre className="code-block">{`# Podfile (native iOS host)
pod 'RNModule', :git => 'git@.../rn-binary.git',
             :tag => '4.12.0' # XCFramework

// build.gradle (native Android host)
implementation 'com.company:rn-module:4.12.0' // AAR`}</pre>
    </DemoPanel>
  );
}

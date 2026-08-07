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
      <pre className="code-block">{`# build-rn-binary.sh — runs in the RN repo's own CI, not the host app's
set -euo pipefail
VERSION=$(node -p "require('./package.json').version")

# iOS: static XCFramework, arm64 device + arm64/x86_64 simulator slices
xcodebuild archive -workspace ios/RNModule.xcworkspace \\
  -scheme RNModule -configuration Release \\
  -archivePath build/RNModule.xcarchive SKIP_INSTALL=NO
xcodebuild -create-xcframework \\
  -archive build/RNModule.xcarchive -framework RNModule.framework \\
  -output build/RNModule.xcframework

# Android: AAR via a dedicated Gradle module, Hermes bundled
./gradlew :rn-module:assembleRelease
cp android/rn-module/build/outputs/aar/rn-module-release.aar \\
   build/rn-module-$VERSION.aar

# publish both artifacts, native teams pull by version tag
pod repo push internal-specs RNModule.podspec
./gradlew :rn-module:publish -PreleaseVersion=$VERSION

git tag "rn-binary-v$VERSION" && git push origin "rn-binary-v$VERSION"

# — consumer side —
# Podfile (native iOS host app)
pod 'RNModule', :git => 'git@gitlab.../rn-binary.git', :tag => "4.12.0"

// build.gradle (native Android host app)
implementation "com.planradar:rn-module:4.12.0"
// no node_modules, no Metro, no Yarn install in the native repo's CI`}</pre>
    </DemoPanel>
  );
}

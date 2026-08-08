import { useTranslation } from 'react-i18next';
import DemoPanel from '../sharedComponents/DemoPanel';
import PipelineSteps, { usePipeline } from '../sharedComponents/PipelineSteps';
import CodeTabs from '../sharedComponents/CodeTabs';

export default function ReleaseDemo() {
  const { t } = useTranslation();
  const STEPS = [
    t('demoUI.release.step1'),
    t('demoUI.release.step2'),
    t('demoUI.release.step3'),
    t('demoUI.release.step4'),
    t('demoUI.release.step5'),
  ];
  const { states, run } = usePipeline(STEPS, 550);

  return (
    <DemoPanel
      desc={t('demoText.release.desc')}
      note={t('demoText.release.note')}
    >
      <div className="demo-box">
        <button className="btn btn-primary" style={{ padding: '9px 16px', marginBottom: 16 }} onClick={run}>{t('demoUI.release.runButton')}</button>
        <PipelineSteps steps={STEPS} states={states} />
      </div>
      <CodeTabs
        files={[
          {
            name: 'build-rn-binary.sh',
            code: `#!/usr/bin/env bash
# runs in the RN repo's own CI, not the host app's
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

git tag "rn-binary-v$VERSION" && git push origin "rn-binary-v$VERSION"`,
          },
          {
            name: 'Podfile',
            code: `# native iOS host app — pulls the versioned XCFramework, no RN toolchain
target 'MobileHostApp' do
  pod 'RNModule', :git => 'git@gitlab.../rn-binary.git', :tag => '4.12.0'

  # native iOS engineers bump this one line and run \`pod install\` —
  # no node_modules, no Metro, nothing RN-specific in this repo's CI
end`,
          },
          {
            name: 'build.gradle',
            code: `// native Android host app module — same idea, versioned AAR
dependencies {
    implementation "com.company:rn-module:4.12.0"

    // consumed like any other internal Android library —
    // Gradle resolves it from our private Maven registry
}

// CI here only runs ./gradlew assembleRelease — no yarn install step exists`,
          },
        ]}
      />
    </DemoPanel>
  );
}

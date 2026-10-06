import { OnboardingView } from './OnboardingView';
import { useOnboardingVals } from './onboardingVals';

export function Onboarding() {
  return <OnboardingView v={useOnboardingVals()} />;
}

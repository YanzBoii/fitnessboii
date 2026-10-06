import { useAuthVals } from './authVals';
import { AuthView } from './AuthView';

export function AuthScreen() {
  return <AuthView v={useAuthVals()} />;
}

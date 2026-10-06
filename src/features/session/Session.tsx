import { SessionView } from './SessionView';
import { useSessionVals } from './sessionVals';

export function Session() {
  return <SessionView v={useSessionVals()} />;
}

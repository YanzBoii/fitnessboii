import { PerfsView } from './PerfsView';
import { usePerfsVals } from './perfsVals';

export function Perfs() {
  return <PerfsView v={usePerfsVals()} />;
}

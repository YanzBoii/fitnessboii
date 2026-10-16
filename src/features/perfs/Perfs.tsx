import { PerfsView } from './PerfsView';
import { usePerfsVals } from './perfsVals';
import { SessionHistory } from './SessionHistory';

export function Perfs() {
  return (
    <>
      <PerfsView v={usePerfsVals()} />
      <SessionHistory />
    </>
  );
}

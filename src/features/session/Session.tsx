import { Builder } from '../programs/Programs';
import { SessionView } from './SessionView';
import { useSessionVals } from './sessionVals';

export function Session() {
  const v = useSessionVals();
  return (
    <>
      <SessionView v={v} />
      {v.editor && <Builder program={v.editor.program} onClose={v.editor.onClose} onSession={v.editor.onApply} />}
    </>
  );
}

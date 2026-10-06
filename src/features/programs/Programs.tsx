import { ProgramsView } from './ProgramsView';
import { useProgramsVals } from './programsVals';

export function Programs() {
  return <ProgramsView v={useProgramsVals()} />;
}

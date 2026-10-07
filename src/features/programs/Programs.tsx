import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Program } from '../../domain/types';
import { BuilderView } from './BuilderView';
import { useBuilderVals } from './builderVals';
import { ProgramsView } from './ProgramsView';
import { useProgramsVals } from './programsVals';

function Builder({ program, onClose }: { program: Program | null; onClose: () => void }) {
  return createPortal(<BuilderView v={useBuilderVals(program, onClose)} />, document.body);
}

export function Programs() {
  // undefined = fermé, null = nouveau programme, Program = modification.
  const [editing, setEditing] = useState<Program | null | undefined>(undefined);
  const close = () => setEditing(undefined);
  return (
    <>
      <ProgramsView v={useProgramsVals(setEditing)} />
      {editing !== undefined && <Builder key={editing?.id ?? 'new'} program={editing} onClose={close} />}
    </>
  );
}

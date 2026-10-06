import type { MouseEvent } from 'react';
import { useApp } from '../../state/app';
import { fadeRef, popRef } from '../../ui/anim';

export function usePhotoPromptVals() {
  const a = useApp();
  return {
    fadeRef: fadeRef(260), popRef,
    sheetAlign: a.isMobile ? 'flex-end' : 'center', sheetPad: a.isMobile ? '0' : '24px', sheetRadius: a.isMobile ? '26px 26px 0 0' : '26px',
    stop: (ev: MouseEvent) => ev.stopPropagation(),
    photoLater: () => a.setPhotoPrompt(false),
    pickPhoto: () => !a.photoBusy && a.pickPhoto()
  };
}

export type PhotoPromptVals = ReturnType<typeof usePhotoPromptVals>;

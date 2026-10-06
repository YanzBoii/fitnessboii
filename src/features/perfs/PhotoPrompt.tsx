import { PhotoPromptView } from './PhotoPromptView';
import { usePhotoPromptVals } from './photoPromptVals';

export function PhotoPrompt() {
  return <PhotoPromptView v={usePhotoPromptVals()} />;
}

import { Home } from '../home/Home';
import { Perfs } from '../perfs/Perfs';
import { PhotoPrompt } from '../perfs/PhotoPrompt';
import { ProfileSheet } from '../profile/ProfileSheet';
import { Programs } from '../programs/Programs';
import { Session } from '../session/Session';
import { Settings } from '../settings/Settings';
import { useApp } from '../../state/app';
import { ShellView } from './ShellView';
import { useShellVals } from './shellVals';

const SCREENS = { home: Home, programs: Programs, session: Session, perf: Perfs, settings: Settings };

export function Shell() {
  const { tab, profileOpen, photoPrompt } = useApp();
  const Screen = SCREENS[tab];
  return (
    <ShellView v={useShellVals()} overlays={<>{profileOpen && <ProfileSheet />}{photoPrompt && <PhotoPrompt />}</>}>
      <Screen />
    </ShellView>
  );
}

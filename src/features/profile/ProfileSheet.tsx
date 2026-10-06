import { ProfileView } from './ProfileView';
import { useProfileVals } from './profileVals';

export function ProfileSheet() {
  return <ProfileView v={useProfileVals()} />;
}

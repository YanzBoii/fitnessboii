import { InstallCard } from '../install/InstallCard';
import { SettingsView } from './SettingsView';
import { useSettingsVals } from './settingsVals';

export function Settings() {
  return (
    <>
      <InstallCard />
      <SettingsView v={useSettingsVals()} />
    </>
  );
}

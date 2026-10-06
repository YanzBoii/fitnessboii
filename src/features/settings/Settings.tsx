import { SettingsView } from './SettingsView';
import { useSettingsVals } from './settingsVals';

export function Settings() {
  return <SettingsView v={useSettingsVals()} />;
}

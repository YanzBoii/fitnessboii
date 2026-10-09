import { InstallCard } from '../install/InstallCard';
import { HomeView } from './HomeView';
import { useHomeVals } from './homeVals';

export function Home() {
  return (
    <>
      <InstallCard banner />
      <HomeView v={useHomeVals()} />
    </>
  );
}

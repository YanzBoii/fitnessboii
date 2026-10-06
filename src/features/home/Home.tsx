import { HomeView } from './HomeView';
import { useHomeVals } from './homeVals';

export function Home() {
  return <HomeView v={useHomeVals()} />;
}

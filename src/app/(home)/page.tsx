import { Home } from '@/components/home/home';
import { gitConfig } from '@/lib/shared';

export default function HomePage() {
  return <Home repoUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}`} />;
}

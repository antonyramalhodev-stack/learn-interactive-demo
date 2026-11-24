import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { MortarBoardIcon } from '@primer/octicons-react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <MortarBoardIcon size={20} aria-hidden />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

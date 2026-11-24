import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Learning Lab';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

// If you fork or rename the repository, update the owner and name here.
export const gitConfig = {
  user: 'antonyramalhodev-stack',
  repo: 'learn-interactive-demo',
  branch: 'main',
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}

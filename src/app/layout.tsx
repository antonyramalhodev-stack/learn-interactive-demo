import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { appName } from '@/lib/shared';
import '@fontsource-variable/mona-sans/index.css';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000'),
  title: {
    template: `%s | ${appName}`,
    default: appName,
  },
  description:
    'A demo of interactive learning content built with Fumadocs and the Primer design system, hosted on GitHub Pages.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    // data-light-theme and data-dark-theme tell Primer which color theme to use in each mode.
    <html lang="en" data-light-theme="light" data-dark-theme="dark" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

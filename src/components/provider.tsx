'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ SearchDialog }}
      theme={{
        // "class" drives Fumadocs and Tailwind (.dark).
        // "data-color-mode" drives the Primer design tokens.
        attribute: ['class', 'data-color-mode'],
      }}
    >
      {children}
    </RootProvider>
  );
}

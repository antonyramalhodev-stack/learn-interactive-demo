import type { ReactNode } from 'react';

/**
 * Several elements take a short text script between their tags:
 *
 *   <Terminal>{`
 *   $ git status
 *   `}</Terminal>
 *
 * This reads that text and returns its lines, without the empty ones.
 */
export function scriptLines(children: ReactNode, element: string): string[] {
  if (typeof children !== 'string') {
    throw new Error(`<${element}> expects text between its tags, inside {\`...\`}.`);
  }
  return children
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== '');
}

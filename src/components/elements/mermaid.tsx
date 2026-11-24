'use client';

import { useEffect, useId, useState } from 'react';
import { useColorMode } from './hooks';
import { scriptLines } from './script';
import ui from './panel.module.css';
import styles from './mermaid.module.css';

export interface MermaidProps {
  /** A short description of the diagram for screen readers. */
  label: string;
  /** The Mermaid diagram text. */
  children: string;
}

/**
 * A diagram from text, drawn in the browser with the Primer colors.
 *
 *   <Mermaid label="Flow from a branch to a pull request">{`
 *   flowchart LR
 *     A[Create a branch] --> B[Open a pull request]
 *   `}</Mermaid>
 */
export function Mermaid({ label, children }: MermaidProps) {
  const chart = scriptLines(children, 'Mermaid').join('\n');
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const mode = useColorMode();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const { default: mermaid } = await import('mermaid');
      const css = getComputedStyle(document.documentElement);
      const token = (name: string) => css.getPropertyValue(name).trim();

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'inherit',
        themeVariables: {
          darkMode: mode === 'dark',
          background: token('--bgColor-default'),
          primaryColor: token('--bgColor-muted'),
          primaryTextColor: token('--fgColor-default'),
          primaryBorderColor: token('--borderColor-default'),
          secondaryColor: token('--bgColor-accent-muted'),
          tertiaryColor: token('--bgColor-default'),
          lineColor: token('--fgColor-muted'),
          textColor: token('--fgColor-default'),
        },
      });

      const result = await mermaid.render(`mermaid-${id}`, chart);
      if (!cancelled) setSvg(result.svg);
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [chart, id, mode]);

  return (
    <div
      className={`learn-element not-prose ${ui.root} ${styles.diagram}`}
      role="img"
      aria-label={label}
      // Mermaid sanitizes the SVG (securityLevel: strict) and the source is this site's own MDX.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

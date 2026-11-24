'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'fumadocs-ui/provider/base';
import styles from './learn.module.css';

/**
 * Renders a Mermaid diagram in the browser and colors it with Primer tokens.
 * The diagram redraws when the reader changes the color mode.
 */
export function Mermaid({ chart, label }: { chart: string; label?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { resolvedTheme } = useTheme();
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
          darkMode: resolvedTheme === 'dark',
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
  }, [chart, id, resolvedTheme]);

  return (
    <div
      className={`learn-widget not-prose ${styles.diagram}`}
      role="img"
      aria-label={label ?? 'Diagram'}
      // Mermaid sanitizes the SVG (securityLevel: strict) and the source is this site's own MDX.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

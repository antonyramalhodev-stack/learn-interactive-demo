'use client';

import { useEffect, useMemo, useState } from 'react';
import { IconButton } from '@primer/react';
import { CheckIcon, CopyIcon, SyncIcon, TerminalIcon } from '@primer/octicons-react';
import { useCopy, useInView, useReducedMotion } from './hooks';
import { Panel } from './panel';
import { scriptLines } from './script';
import ui from './panel.module.css';
import styles from './terminal.module.css';

export interface TerminalProps {
  title?: string;
  /** Start again a few seconds after the last line. */
  loop?: boolean;
  /** Milliseconds for each typed character. */
  speed?: number;
  /** The session. A line that starts with `$` is a command, and `#` starts a comment. */
  children: string;
}

/**
 * A terminal session that types itself when the reader scrolls to it. Nothing runs.
 *
 *   <Terminal title="Create a branch">{`
 *   $ git switch -c update-readme
 *   Switched to a new branch 'update-readme'
 *   # Push the branch
 *   $ git push -u origin update-readme
 *   `}</Terminal>
 */
export function Terminal({ title = 'Terminal', loop = false, speed = 32, children }: TerminalProps) {
  const lines = useMemo(
    () =>
      scriptLines(children, 'Terminal').map((line) => {
        const text = line.trimStart();
        if (text.startsWith('$ ')) return { type: 'command', text: text.slice(2) } as const;
        if (text.startsWith('#')) return { type: 'comment', text } as const;
        return { type: 'output', text: line } as const;
      }),
    [children],
  );

  const [ref, inView] = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const [copied, copy] = useCopy();
  // `line` is the line being written, and `chars` is how much of a command is typed.
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const done = line >= lines.length;

  useEffect(() => {
    if (reduced) {
      setLine(lines.length);
      return;
    }
    if (!inView) return;

    let delay = 3200;
    let next = () => {
      setLine(0);
      setChars(0);
    };

    if (done) {
      if (!loop) return;
    } else {
      const current = lines[line];
      const typing = current.type === 'command' && chars < current.text.length;
      delay = typing ? speed : current.type === 'command' ? 520 : 260;
      next = typing
        ? () => setChars(chars + 1)
        : () => {
            setLine(line + 1);
            setChars(0);
          };
    }

    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
  }, [chars, done, inView, line, lines, loop, reduced, speed]);

  const commands = lines.filter((item) => item.type === 'command').map((item) => item.text);

  return (
    <Panel
      ref={ref}
      flush
      title={title}
      icon={<TerminalIcon size={16} aria-hidden />}
      actions={
        <>
          <IconButton
            icon={copied ? CheckIcon : CopyIcon}
            aria-label={copied ? 'Copied' : 'Copy the commands'}
            size="small"
            variant="invisible"
            onClick={() => copy(commands.join('\n'))}
          />
          <IconButton
            icon={SyncIcon}
            aria-label="Replay"
            size="small"
            variant="invisible"
            onClick={() => {
              setLine(0);
              setChars(0);
            }}
          />
        </>
      }
    >
      <div className={styles.screen} style={{ ['--lines' as string]: lines.length }}>
        {lines.slice(0, line + 1).map((item, index) => {
          const active = index === line;
          // An output or comment line appears whole, on the next tick.
          if (active && item.type !== 'command') return null;
          return (
            <div key={index} className={`${styles.line} ${styles[item.type]}`}>
              {item.type === 'command' ? <span className={ui.prompt}>$</span> : null}
              {active ? item.text.slice(0, chars) : item.text}
              {active ? <span className={ui.caret} aria-hidden /> : null}
            </div>
          );
        })}
        {done ? (
          <div className={styles.line}>
            <span className={ui.prompt}>$</span>
            <span className={ui.caret} aria-hidden />
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

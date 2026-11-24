'use client';

import { useEffect, useState } from 'react';
import { IconButton } from '@primer/react';
import { CheckIcon, CopyIcon, SyncIcon, TerminalIcon } from '@primer/octicons-react';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

export interface TerminalLine {
  /** `command` types itself out. `output` and `comment` appear at once. */
  type?: 'command' | 'output' | 'comment';
  text: string;
}

export interface TerminalProps {
  title?: string;
  lines: TerminalLine[];
  /** Start again a few seconds after the last line. */
  loop?: boolean;
  /** Milliseconds for each typed character. */
  speed?: number;
  onStatus?: (text: string) => void;
}

/**
 * A terminal session that types itself when the reader scrolls to it.
 * Nothing runs: the component plays back the lines you give it.
 */
export function Terminal({ title = 'Terminal', lines, loop = false, speed = 32, onStatus }: TerminalProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [copied, setCopied] = useState(false);

  const done = line >= lines.length;

  useEffect(() => {
    if (reduced) {
      setLine(lines.length);
      return;
    }
    if (!inView) return;
    if (done) {
      if (!loop) return;
      const id = window.setTimeout(() => {
        setLine(0);
        setChars(0);
      }, 3200);
      return () => window.clearTimeout(id);
    }

    const current = lines[line];
    const isCommand = (current.type ?? 'command') === 'command';
    const typing = isCommand && chars < current.text.length;
    const delay = typing ? speed : isCommand ? 520 : 260;

    const id = window.setTimeout(() => {
      if (typing) {
        setChars((value) => value + 1);
      } else {
        setLine((value) => value + 1);
        setChars(0);
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [chars, done, inView, line, lines, loop, reduced, speed]);

  useEffect(() => {
    if (!onStatus || !inView || done) return;
    const current = lines[line];
    if ((current.type ?? 'command') === 'command') onStatus(`$ ${current.text}`);
  }, [done, inView, line, lines, onStatus]);

  const replay = () => {
    setLine(0);
    setChars(0);
  };

  const copy = async () => {
    const commands = lines
      .filter((item) => (item.type ?? 'command') === 'command')
      .map((item) => item.text)
      .join('\n');
    try {
      await navigator.clipboard.writeText(commands);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Some embedded previews block the clipboard. The commands stay visible to copy by hand.
    }
  };

  return (
    <div ref={ref} className="learn-widget not-prose">
      <Window
        title={title}
        icon={<TerminalIcon size={16} aria-hidden />}
        label={`${title}: example terminal session`}
        actions={
          <>
            <IconButton
              icon={copied ? CheckIcon : CopyIcon}
              aria-label={copied ? 'Copied' : 'Copy the commands'}
              size="small"
              variant="invisible"
              onClick={copy}
            />
            <IconButton
              icon={SyncIcon}
              aria-label="Replay"
              size="small"
              variant="invisible"
              onClick={replay}
            />
          </>
        }
      >
        <div
          className={styles.terminal}
          style={{ ['--terminal-lines' as string]: lines.length }}
          role="log"
          aria-live="off"
        >
          {lines.map((item, index) => {
            if (index > line) return null;
            const type = item.type ?? 'command';
            const active = index === line;
            const text = active && type === 'command' ? item.text.slice(0, chars) : item.text;
            if (active && type !== 'command') return null;
            return (
              <div key={`${index}-${item.text}`} className={`${styles.terminalLine} ${styles[`terminal_${type}`]}`}>
                {type === 'command' ? <span className={styles.prompt}>$</span> : null}
                <span>{text}</span>
                {active ? <span className={styles.caret} aria-hidden /> : null}
              </div>
            );
          })}
          {done ? (
            <div className={styles.terminalLine}>
              <span className={styles.prompt}>$</span>
              <span className={styles.caret} aria-hidden />
            </div>
          ) : null}
        </div>
      </Window>
    </div>
  );
}
